import prisma from "../config/db.js";
import { FileManager } from "../models/fileManager.js";

const userServices = {
  getAllUsers: async () => {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  },
  getUserByMobileNumber: async (mobileNumber) => {
    try {
      const user = await prisma.user.findUnique({
        where: { mobileNumber: mobileNumber },
      });
      return user;
    } catch (error) {
      throw new Error("Failed to fetch user by mobile number");
    }
  },
  getUserByEmail: async (email) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      throw new Error("Failed to fetch user by email");
    }
  },
  getUserById: async (userId) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      return user;
    } catch (error) {
      throw new Error("Failed to fetch user by ID");
    }
  },
  editUser: async (formData, user) => {
    try {
      const updateData = {};

      if (formData.fullName) {
        updateData.fullName = formData.fullName;
      }
      if (formData.mobileNumber) {
        updateData.mobileNumber = formData.mobileNumber;
      }
      if (formData.email) {
        updateData.email = formData.email;
      }
      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await prisma.user.update({
        where: { id: Number(user.id) },
        data: updateData,
      });

      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },
  createUser: async (userData) => {
    try {
      const newUser = await prisma.user.create({
        data: {
          fullName: userData.fullName,
          mobileNumber: userData.mobileNumber || null,
          email: userData.email || null,
          password: userData.password,
          role: "USER",
        },
      });
      return newUser;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },
  deleteUser: async (userId) => {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: Number(userId) },
      });
      return deletedUser;
    } catch (error) {
      throw new Error(`Failed to delete user ${error.message}`);
    }
  },
  uploadImages: async (images, userId) => {
    try {
      const filesData = images.map((file) => ({
        size: file.size,
        mimetype: file.mimetype,
        originalname: file.originalname,
        highlyCompressedPath: file.highlyCompressedPath,
        mediumCompressedPath: file.mediumCompressedPath,
        userId,
      }));
      return await FileManager.insertMany(filesData);
    } catch (error) {
      throw new Error(`Failed to save images ${error.message}`);
    }
  },
};

export default userServices;
