import express from "express";
import { createUser, getUsers, getLeaderboard, loginUser, getProfile, updateProfile } from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/leaderboard", getLeaderboard);
// @ts-ignore
router.get("/me", authMiddleware, getProfile);
// @ts-ignore
router.put("/me", authMiddleware, updateProfile);

export default router;
