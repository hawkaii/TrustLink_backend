import express from "express";
import userController from "../controllers/userController.js";

import { verifyAuthentication } from "../passport/passport.js";

const router = express.Router();

router.get("/users", userController.getUsers);
router.get("/users/:id", verifyAuthentication, userController.getUserById);
router.put("/users", verifyAuthentication, userController.editUser);
router.delete("/users", verifyAuthentication, userController.deleteUser);

export default router;
