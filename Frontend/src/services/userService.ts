import api from "./api";

export const loginUser = (data: {
  email: string;
  password: string;
}) => api.post("/users/login", data);

export const getProfile = () => api.get("/users/me");

export const getLeaderboard = () => api.get("/users/leaderboard");

export const updateUser = (data: any) => api.put("/users/me", data);

