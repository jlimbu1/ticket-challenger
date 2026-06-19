import { io, Socket } from "socket.io-client";

// Create a singleton instance
let socket: Socket | null = null;

export const connectSocket = (token = null) => {
  // If socket already exists, return it
  if (socket) return socket;

  console.log(import.meta.env.VITE_SOCKET_URL);

  // Create new connection
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: token ? { token } : null,
    autoConnect: false,
    path: "/socket.io",
    transports: ["websocket", "polling"],
  });

  // Basic listeners
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  // Connect manually
  socket.connect();

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
