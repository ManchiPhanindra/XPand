import { Request, Response } from "express";
import Review from "../models/Review.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

export const createReview = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const reviewerId = req.user.id;
        const { bookingId, rating, comment } = req.body;

        // 1. Verify that a completed booking exists
        const booking = await Booking.findOne({
            _id: bookingId,
            status: "completed"
        }).populate("offerId");

        if (!booking) {
            return res.status(400).json({ message: "Invalid booking or not completed yet." });
        }

        // @ts-ignore
        const offer: any = booking.offerId;

        // @ts-ignore
        if (booking.requesterId.toString() !== reviewerId) {
            return res.status(403).json({ message: "Only the requester can review." });
        }

        // 2. Create Review
        const review = await Review.create({
            reviewerId,
            receiverId: offer.userId, // Reviewing the provider (Host)
            offerId: offer._id,
            bookingId,
            rating,
            comment
        });

        // 3. Update User's Average Rating
        // @ts-ignore
        const user: any = await User.findById(offer.userId);
        if (user) {
            const totalRating = (user.averageRating || 0) * (user.reviewCount || 0);
            user.reviewCount = (user.reviewCount || 0) + 1;
            user.averageRating = (totalRating + rating) / user.reviewCount;
            await user.save();
        }

        res.status(201).json(review);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already reviewed this session." });
        }
        console.error("createReview: ERROR", error);
        res.status(500).json({ message: "Error creating review", error: error.toString() });
    }
};

export const getReviews = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const reviews = await Review.find({ receiverId: userId } as any)
            .populate("reviewerId", "name avatar")
            .populate("offerId", "title tag")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error });
    }
};
