import { create } from "zustand";
import { io } from "socket.io-client";

export const useSocketStore = create(() => ({
  socket: io(import.meta.env.VITE_BASE_URL_SOCKET|| "http://localhost:3002", { withCredentials: true }),
}));
