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
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY4NjI4MDU5LTFmYjYtNDNlZS1hNzM2LThiMDY1NDAxOTYzNSIsImVtYWlsIjoiZ3VoYW5yYW1hbGluZ2FtMTkwOUBnbWFpbC5jb20iLCJwaG9uZSI6IjYzODIwNTMyNDkiLCJwYXJ0bmVyX2lkIjoiZTg3YWJkNzgtZTRlZS00NDc3LWE3YWQtMGZjMjE2Y2E0MzdiIiwiaWF0IjoxNzUxMjY4OTM4LCJleHAiOjE3NTEyNzYxMzh9.3DbV2qnwdlLpe3UE4uZB71lUVntFiphn2uudXmVWJrk";
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
