import api from "./api";

export const createBooking = (offerId: string, requesterId: string) =>
  api.post("/bookings", { offerId, requesterId });

export const getMyBookings = () =>
  api.get("/bookings");

export const updateBookingStatus = (id: string, status: string, meetingLink?: string) =>
  api.patch(`/bookings/${id}`, { status, meetingLink });

export const acceptBooking = (id: string, meetingLink: string) =>
  api.patch(`/bookings/${id}/accept`, { meetingLink });

export const rejectBooking = (id: string) =>
  api.patch(`/bookings/${id}/reject`);

export const completeBooking = (id: string) =>
  api.patch(`/bookings/${id}/complete`);
