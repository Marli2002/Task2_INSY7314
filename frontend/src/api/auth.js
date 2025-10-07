// src/api/auth.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token automatically if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers["x-auth-token"] = token;
  return req;
});

// Register user
export const registerUser = (userData) => API.post("/register", userData);

// Login user
export const loginUser = (userData) => API.post("/login", userData);

// Logout user
export const logoutUser = () => API.post("/logout");