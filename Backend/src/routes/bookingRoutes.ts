import express from "express";
import { createBooking, getMyBookings, updateBookingStatus, acceptBooking, rejectBooking, completeBooking } from "../controllers/bookingController";
import { authMiddleware } from "../middleware/auth";
import { checkBookingOwnership } from "../middleware/ownership";

const router = express.Router();

// @ts-ignore
router.post("/", authMiddleware, createBooking);
// @ts-ignore
router.get("/", authMiddleware, getMyBookings);

// Lifecycle routes
// @ts-ignore
router.patch("/:id/accept", authMiddleware, checkBookingOwnership, acceptBooking);
// @ts-ignore
router.patch("/:id/reject", authMiddleware, checkBookingOwnership, rejectBooking);
// @ts-ignore
router.patch("/:id/complete", authMiddleware, checkBookingOwnership, completeBooking);

// keeping generic update for backward compatibility or admin use if needed, but properly protected
// @ts-ignore
router.patch("/:id", authMiddleware, checkBookingOwnership, updateBookingStatus);

export default router;
