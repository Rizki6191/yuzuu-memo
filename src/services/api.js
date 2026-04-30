import axios from "axios";

// Global fallback untuk Android web view yang mungkin tidak support localStorage
window.__adminKey = null;

const API = axios.create({
  baseURL: "https://rainbowy-stephanie-barest.ngrok-free.dev",
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});

// Interceptor untuk menambahkan Authorization header jika ada admin key
API.interceptors.request.use((config) => {
  try {
    // Coba localStorage dulu, fallback ke window variable
    let adminKey = null;
    
    try {
      adminKey = localStorage.getItem("adminKey");
    } catch (e) {
      console.log("[API] localStorage not available:", e.message);
    }
    
    if (!adminKey) {
      adminKey = window.__adminKey;
    }
    
    if (adminKey && adminKey.trim()) {
      config.headers.Authorization = `Bearer ${adminKey}`;
      console.log("[API] Request:", config.method?.toUpperCase(), config.url);
      console.log("[API] Authorization header added, key length:", adminKey.length);
    } else {
      console.log("[API] No admin key available for:", config.method?.toUpperCase(), config.url);
    }
  } catch (e) {
    console.log("[API] Interceptor error:", e.message);
  }
  return config;
});

// Debug interceptor untuk response
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("[API] 403 Forbidden");
      console.error("[API] URL:", error.config.url);
      console.error("[API] Method:", error.config.method?.toUpperCase());
      console.error("[API] Has Authorization:", !!error.config.headers.Authorization);
      console.error("[API] Auth header:", error.config.headers.Authorization);
    }
    return Promise.reject(error);
  }
);

export const getPosts = () => API.get("/posts");

export default API;