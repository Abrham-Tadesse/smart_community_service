import API from "./api";
import { endpoints } from "./endpoints";

export const registerUser = (data) => {
  return API.post(endpoints.register, data);
};

export const loginUser = (data) => {
  return API.post(endpoints.login, data);
};

export const getProfile = () => {
  return API.get(endpoints.me);
};
