import { Strategy as LocalStrategy } from "passport-local";
import userServices from "../services/userServices.js";
import profileServices from "../services/profileServices.js";
import bcrypt from "bcrypt";

const localStrategy = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "identifier", // Use a single field for both email and mobile number
        passwordField: "password",
      },
      async (identifier, password, done) => {
        try {
          let user;
          if (identifier.includes("@")) {
            user = await userServices.getUserByEmail(identifier);
          } else {
            user = await userServices.getUserByMobileNumber(identifier);
          }
          if (!user) {
            return done(null, false, { message: "Invalid credentials" });
          }
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return done(null, false, { message: "Password Incorrect" });
          }

          // Fetch the profile associated with the user
          const profile = await profileServices.getProfileByUserId(user.id);
          if (!profile) {
            return done(null, false, { message: "Profile not found" });
          }

          // Attach the profile to the user object
          user = {
            id: user.id,
            email: user.email,
            mobileNumber: user.mobileNumber,
            profileId: profile._id,
            username: profile.username,
          };

          console.log("User authenticated:", user);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};

export default localStrategy;
