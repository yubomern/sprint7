import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL||"http://localhost:3002/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
