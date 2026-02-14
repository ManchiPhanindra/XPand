import { Request, Response } from "express";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Offer from "../models/Offer.js";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { offerId, requesterId } = req.body;

    // Check if user has enough credits
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: "Offer not found" });


    if (!offer.userId) {
      return res.status(500).json({ message: "Offer data corrupted (no owner)" });
    }

    // @ts-ignore
    if (offer.userId.toString() === requesterId) {
      return res.status(400).json({ message: "Cannot book your own offer" });
    }

    const requester: any = await User.findById(requesterId);
    if (!requester) return res.status(404).json({ message: "User not found" });

    if (requester.credits < offer.credits) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    const booking = await Booking.create({
      offerId,
      requesterId,
      status: "pending"
    });

    // Update user credits logic can be here or on complete
    // For now we just create

    res.status(201).json(booking);
  } catch (error: any) {
    console.error("createBooking: ERROR", error);
    res.status(500).json({ message: "Error creating booking", error: error.toString() });
  }
};

export const acceptBooking = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { isHost } = req;
    const { meetingLink } = req.body;

    if (!isHost) {
      return res.status(403).json({ message: "Only the host can accept a booking" });
    }

    if (!meetingLink) {
      return res.status(400).json({ message: "Meeting link is required to accept" });
    }

    // @ts-ignore
    const booking = await Booking.findByIdAndUpdate(req.params.id, {
      status: "accepted",
      meetingLink
    }, { new: true });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error accepting booking", error });
  }
};

export const rejectBooking = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { isHost } = req;

    if (!isHost) {
      return res.status(403).json({ message: "Only the host can reject a booking" });
    }

    // @ts-ignore
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });

    // Logic to refund credits could go here if we deducted them on creation (currently we deduct on completion)

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error rejecting booking", error });
  }
};

export const completeBooking = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const bookingDoc = req.booking;

    if (bookingDoc.status !== "accepted") {
      return res.status(400).json({ message: "Booking must be accepted before completing" });
    }

    // Mark as completed
    bookingDoc.status = "completed";
    await bookingDoc.save();

    // Transfer credits & Update Stats
    const offer = await Offer.findById(bookingDoc.offerId);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    const giver = await User.findById(offer.userId);
    const receiver = await User.findById(bookingDoc.requesterId);

    if (giver && receiver) {
      // Transfer credits
      receiver.credits -= offer.credits;
      giver.credits += offer.credits;

      // Update stats
      giver.totalHoursGiven += (offer.duration || 0) / 60;
      receiver.totalHoursReceived += (offer.duration || 0) / 60;

      giver.giveScore = giver.totalHoursGiven - giver.totalHoursReceived;
      receiver.giveScore = receiver.totalHoursGiven - receiver.totalHoursReceived;

      await giver.save();
      await receiver.save();
    }

    res.json(bookingDoc);
  } catch (error) {
    res.status(500).json({ message: "Error completing booking", error });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  res.status(405).json({ message: "Use specific endpoints for status updates" });
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    // Outgoing: I (userId) am the requester
    const outgoing = await Booking.find({ requesterId: userId })
      .populate({
        path: "offerId",
        populate: { path: "userId", select: "name avatar" }
      })
      .populate("requesterId", "name email");

    // Incoming: I (userId) am the owner of the offer
    // First find all offers owned by me
    const myOffers = await Offer.find({ userId });
    const myOfferIds = myOffers.map(offer => offer._id);

    // Then find bookings for those offers
    const incoming = await Booking.find({ offerId: { $in: myOfferIds } })
      .populate({
        path: "offerId",
        populate: { path: "userId", select: "name avatar" }
      })
      .populate("requesterId", "name email");

    res.json({ incoming, outgoing });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};
