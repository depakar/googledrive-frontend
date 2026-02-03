import axios from "axios";
import toast from "react-hot-toast";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");

      // 🔥 global logout hook
      if (window.__LOGOUT__) {
        window.__LOGOUT__();
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
