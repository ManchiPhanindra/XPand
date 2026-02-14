import express from "express";
import { createReview, getReviews } from "../controllers/reviewController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/:userId", getReviews);

export default router;
