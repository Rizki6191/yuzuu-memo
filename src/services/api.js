import axios from "axios";

const API = axios.create({
  baseURL: "https://rainbowy-stephanie-barest.ngrok-free.dev",
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});

export const getPosts = () => API.get("/posts");

export default API;