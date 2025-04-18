import passport from "passport";
import localStrategy from "./passport-local.js";
import userServices from "../services/userServices.js";
import profileServices from "../services/profileServices.js";

localStrategy(passport);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userServices.getUserById(id);
    const profile = await profileServices.getProfileByUserId(id);
    if (user && profile) {
      const userWithProfile = {
        id: user.id,
        email: user.email,
        mobileNumber: user.mobileNumber,
        username: profile.username,
        profileId: profile._id,
      };
      return done(null, userWithProfile);
    }
    return done(new Error("User or profile not found"), null);
  } catch (error) {
    return done(error, null);
  }
});

export const verifyAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ message: "Unauthorized" });
};

export const sendAuthStatus = (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      message: `Authenticated as user ${req.user.username}`,
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const signin = (req, res) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return res.status(401).json({ message: `Authentication error: ${err}` });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.login(user, (error) => {
      if (error) {
        return res
          .status(500)
          .json({ message: `Login error: ${error.message}` });
      }

      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res);
};

export const signout = (req, res, next) => {
  const userId = req.user ? req.user.id : null;
  const userRole = req.user ? req.user.role : null;

  req.logout((error) => {
    if (error) {
      res.status(500).json({ message: `Logout error: ${error}` });
    }

    req.session.destroy((error) => {
      if (error) {
        res.status(500).json({ message: `Session destroy error: ${error}` });
      }

      res.clearCookie("connect.sid");

      if (userRole === "USER") {
        res.status(200).json({ message: "Logout successful" });
      } else if (userRole === "GUEST") {
        req.userId = userId;
        next();
      }
    });
  });
};

export default passport;
