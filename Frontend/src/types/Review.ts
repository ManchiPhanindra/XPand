import type { User } from "./User";
import type { Offer } from "./Offer";

export interface Review {
    _id: string;
    reviewerId: User;
    receiverId: string;
    offerId: Offer;
    bookingId: string;
    rating: number;
    comment: string;
    createdAt: string;
}
