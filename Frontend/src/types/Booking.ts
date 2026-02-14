import type { Offer } from "./Offer";
import type { User } from "./User";

export interface Booking {
  _id: string;
  offerId: Offer;
  requesterId: User;
  status: "pending" | "accepted" | "completed" | "rejected";
  meetingLink?: string;
  note?: string;
  createdAt: string;
}
