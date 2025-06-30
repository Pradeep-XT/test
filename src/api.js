// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.5:3000/api/v1/onscan",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = import.meta.env.VITE_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
