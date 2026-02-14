import api from "./api";

export const createOffer = (data: any) =>
  api.post("/offers", data);

export const getOffers = () =>
  api.get("/offers");

export const updateOffer = (id: string, data: any) =>
  api.put(`/offers/${id}`, data);

export const deleteOffer = (id: string) =>
  api.delete(`/offers/${id}`);
