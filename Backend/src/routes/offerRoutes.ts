import express from "express";
import { createOffer, getOffers, getOfferById, updateOffer, deleteOffer } from "../controllers/offerController";
import { authMiddleware } from "../middleware/auth";
import { checkOfferOwnership } from "../middleware/ownership";

const router = express.Router();

// @ts-ignore
router.post("/", authMiddleware, createOffer);
router.get("/", getOffers);
router.get("/:id", getOfferById);
// @ts-ignore
router.put("/:id", authMiddleware, checkOfferOwnership, updateOffer);
// @ts-ignore
router.delete("/:id", authMiddleware, checkOfferOwnership, deleteOffer);

export default router;
