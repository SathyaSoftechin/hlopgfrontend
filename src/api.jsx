// frontend/api.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "https://hlopgbackend.vercel.app/api", // backend URL
});

export default api;
