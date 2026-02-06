import axios from "./axios.js";

export const loginApi = async (data) => {
  const res = await axios.post("/auth/login", data);
  return res.data;
};
