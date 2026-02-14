import { Request, Response } from "express";
import Offer from "../models/Offer";

export const createOffer = async (req: Request, res: Response) => {
  try {
    const { title, description, tag, duration, credits, prerequisites, availability, format } = req.body;
    // @ts-ignore
    const userId = req.user.id;

    const offer = await Offer.create({
      title,
      description,
      tag,
      duration,
      credits,
      prerequisites,
      availability,
      format,
      userId
    });
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: "Error creating offer", error });
  }
};

export const getOffers = async (req: Request, res: Response) => {
  try {
    const { search, tag } = req.query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: new RegExp(search as string, "i") },
        { description: new RegExp(search as string, "i") }
      ];
    }

    if (tag) {
      filter.tag = new RegExp(tag as string, "i");
    }

    const offers = await Offer.find(filter).populate("userId", "name giveScore avatar");
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching offers", error });
  }
};

export const getOfferById = async (req: Request, res: Response) => {
  try {
    const offer = await Offer.findById(req.params.id).populate("userId", "name giveScore avatar");
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching offer", error });
  }
};

export const updateOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndUpdate(id, req.body, { new: true });
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: "Error updating offer", error });
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting offer", error });
  }
};
