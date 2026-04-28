import API from "./api";

export const registerUser = (data) => {
  return API.post("/users", data);
};

export const loginUser = (data) => {
  return API.post("/users/login", data);
};

export const getProfile = () => {
  return API.get("/users/me");
};