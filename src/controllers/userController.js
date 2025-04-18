import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import userServices from "../services/userServices.js";
import profileServices from "../services/profileServices.js";
import mongoose from "mongoose";

const userController = {
  // Get all users
  getUsers: async (req, res) => {
    try {
      const users = await userServices.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a user by their ID
  getUserById: async (req, res) => {
    try {
      const user = await userServices.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new user
  createUser: [
    body("fullName", "Full name must be at least 2 characters")
      .trim()
      .isLength({ min: 2 })
      .escape(),
    body("mobileNumber", "Mobile number must be at least 10 characters")
      .optional()
      .trim()
      .isLength({ min: 10 })
      .escape()
      .custom(async (value) => {
        if (value) {
          const user = await userServices.getUserByMobileNumber(value);
          if (user) {
            throw new Error("Mobile number already exists");
          }
        }
        return true;
      }),
    body("email", "Invalid email format")
      .optional()
      .trim()
      .isEmail()
      .escape()
      .custom(async (value) => {
        if (value) {
          const user = await userServices.getUserByEmail(value);
          if (user) {
            throw new Error("Email already exists");
          }
        }
        return true;
      }),
    body("password", "Password must be at least 6 characters")
      .trim()
      .isLength({ min: 6 })
      .escape(),
    async (req, res) => {
      const { fullName, mobileNumber, email, password, birthday } = req.body;
      if (!mobileNumber && !email) {
        return res
          .status(400)
          .json({ message: "Either mobile number or email is required" });
      }
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = await userServices.createUser({
          fullName,
          mobileNumber,
          email,
          password: hashedPassword,
          birthday,
        });
        res.status(201).json(userData);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  ],

  // Authenticate user for signin
  authenticateUser: [
    body("identifier", "Mobile number or email is required")
      .trim()
      .notEmpty()
      .escape()
      .custom(async (value, { req }) => {
        let user;
        if (value.includes("@")) {
          user = await userServices.getUserByEmail(value);
        } else {
          user = await userServices.getUserByMobileNumber(value);
        }
        if (!user) {
          throw new Error("Invalid credentials");
        }
        req.user = user;
        return true;
      }),
    body("password", "Password is required")
      .trim()
      .notEmpty()
      .escape()
      .custom(async (value, { req }) => {
        const match = await bcrypt.compare(value, req.user.password);
        if (!match) {
          throw new Error("Password Incorrect");
        }
        return true;
      }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],

  // Delete a user
  deleteUser: async (req, res) => {
    try {
      const user = await userServices.deleteUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await profileServices.deleteProfile(req.user.id);
      return res
        .status(200)
        .json({ message: "User and profile deleted successfully" });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ message: error.message });
      }
    }
  },

  // Edit user details
  editUser: [
    body("fullName", "Full name must be at least 2 characters")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .escape(),
    body("mobileNumber", "Mobile number must be at least 10 characters")
      .optional()
      .trim()
      .isLength({ min: 10 })
      .escape()
      .custom(async (value, { req }) => {
        const user = await userServices.getUserByMobileNumber(value);
        if (user && user.id !== req.user.id) {
          throw new Error("Mobile number already exists");
        }
        return true;
      }),
    body("email", "Invalid email format")
      .optional()
      .trim()
      .isEmail()
      .escape()
      .custom(async (value, { req }) => {
        const user = await userServices.getUserByEmail(value);
        if (user && user.id !== req.user.id) {
          throw new Error("Email already exists");
        }
        return true;
      }),
    body("password", "Password must be at least 6 characters")
      .optional()
      .trim()
      .isLength({ min: 6 })
      .escape(),
    async (req, res) => {
      const formData = {};
      const { fullName, mobileNumber, email, password, birthday } = req.body;

      if (fullName) formData.fullName = fullName;
      if (mobileNumber) formData.mobileNumber = mobileNumber;
      if (email) formData.email = email;
      if (password) formData.password = await bcrypt.hash(password, 10);
      if (birthday) formData.birthday = birthday;

      try {
        const updatedUser = await userServices.editUser(formData, req.user);
        res
          .status(200)
          .json({ updatedUser, message: "User updated successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  ],

  // Create and update profile
  createAndUpdateProfile: async (req, res) => {
    const {
      fullName,
      mobileNumber,
      email,
      password,
      username,
      profession,
      birthday,
      latitude,
      longitude,
      city,
    } = req.body;

    if (
      !username ||
      !profession ||
      !fullName ||
      !password ||
      (!mobileNumber && !email)
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const { files: image } = req;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if the email or mobile number already exists
      if (email) {
        const existingUserByEmail = await userServices.getUserByEmail(email);
        if (existingUserByEmail) {
          throw new Error("Email already exists");
        }
      }

      if (mobileNumber) {
        const existingUserByMobile =
          await userServices.getUserByMobileNumber(mobileNumber);
        if (existingUserByMobile) {
          throw new Error("Mobile number already exists");
        }
      }

      if (username) {
        const existingProfile =
          await profileServices.checkUserNameExists(username);
        if (existingProfile) {
          throw new Error("Username already exists");
        }
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const userData = await userServices.createUser(
        {
          fullName,
          mobileNumber,
          email,
          password: hashedPassword,
        },
        { session },
      );

      // Create or update the profile
      const userId = userData.id;
      const location =
        latitude && longitude && city ? { latitude, longitude, city } : null;
      const profileData = await profileServices.createAndUpdateProfile({
        userId,
        username,
        profession,
        birthday,
        location,
        session,
        image,
      });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Return the combined user and profile data
      res.status(201).json({ user: userData, profile: profileData });
    } catch (error) {
      // Abort the transaction
      await session.abortTransaction();
      session.endSession();

      res.status(500).json({ message: error.message });
    }
  },

  // Validation middleware for user sign-up and profile creation
  validateUserProfile: [
    body("fullName", "Full name must be at least 2 characters")
      .trim()
      .isLength({ min: 2 })
      .escape(),
    body("mobileNumber", "Mobile number must be at least 10 characters")
      .optional()
      .trim()
      .isLength({ min: 10 })
      .escape()
      .custom(async (value) => {
        if (value) {
          const user = await userServices.getUserByMobileNumber(value);
          if (user) {
            throw new Error("Mobile number already exists");
          }
        }
        return true;
      }),
    body("email", "Invalid email format")
      .optional()
      .trim()
      .isEmail()
      .escape()
      .custom(async (value) => {
        if (value) {
          const user = await userServices.getUserByEmail(value);
          if (user) {
            throw new Error("Email already exists");
          }
        }
        return true;
      }),
    body("password", "Password must be at least 6 characters")
      .trim()
      .isLength({ min: 6 })
      .escape(),
    body("username", "Username is required")
      .trim()
      .notEmpty()
      .escape()
      .custom(async (value) => {
        const profile = await profileServices.checkUserNameExists(value);
        if (!profile) {
          throw new Error("Username already exists");
        }
        return true;
      }),
    body("profession", "Profession is required").trim().notEmpty().escape(),
    body("birthday", "Invalid date format").optional().isISO8601().toDate(),
    body("latitude", "Latitude must be a number").optional().isFloat(),
    body("longitude", "Longitude must be a number").optional().isFloat(),
    body("city", "City must be a string").optional().trim().escape(),
  ],
};

export default userController;
