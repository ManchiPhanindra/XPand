import api from "./api";

export const createReview = (data: { offerId: string, receiverId: string, bookingId: string, rating: number, comment: string }) =>
    api.post("/reviews", data);

export const getReviews = (userId: string) =>
    api.get(`/reviews/${userId}`);
