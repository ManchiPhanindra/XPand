import API from "../services/api";

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => API.post("/users/register", data);

export const loginUser = (data: {
  email: string;
  password: string;
}) => API.post("/users/login", data);
