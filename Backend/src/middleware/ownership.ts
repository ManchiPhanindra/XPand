import { Request, Response, NextFunction } from "express";
import Offer from "../models/Offer.js";
import Booking from "../models/Booking.js";

export const checkOfferOwnership = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        const offer = await Offer.findById(id);
        if (!offer) return res.status(404).json({ message: "Offer not found" });

        if (offer.userId?.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to modify this offer" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Error checking ownership", error });
    }
};

export const checkBookingOwnership = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        const booking = await Booking.findById(id).populate("offerId");
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Allow if user is requester OR host (owner of the offer)
        // @ts-ignore
        const isRequester = booking.requesterId.toString() === userId;

        // @ts-ignore
        const offer: any = booking.offerId;
        const isHost = offer.userId.toString() === userId;

        if (!isRequester && !isHost) {
            return res.status(403).json({ message: "Not authorized to modify this booking" });
        }

        // Attach roles to request for controller use if needed
        // @ts-ignore
        req.isRequester = isRequester;
        // @ts-ignore
        req.isHost = isHost;
        // @ts-ignore
        req.booking = booking;

        next();
    } catch (error) {
        res.status(500).json({ message: "Error checking booking ownership", error });
    }
};
