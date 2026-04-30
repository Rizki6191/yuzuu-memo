import axios from "axios";

const API = axios.create({
  baseURL: "https://rainbowy-stephanie-barest.ngrok-free.dev",
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});

// Interceptor untuk menambahkan Authorization header jika ada admin key di localStorage
API.interceptors.request.use((config) => {
  const adminKey = localStorage.getItem("adminKey");
  if (adminKey) {
    config.headers.Authorization = `Bearer ${adminKey}`;
  }
  return config;
});

export const getPosts = () => API.get("/posts");

export default API;