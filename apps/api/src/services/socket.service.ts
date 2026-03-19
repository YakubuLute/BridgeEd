import type { Server } from "http";
import { Server as SocketServer } from "socket.io";

export let io: SocketServer;

export const initSocket = (server: Server) => {
  io = new SocketServer(server, {
    cors: {
      origin: "*", // Adjust in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.info(`[socket] Client connected: ${socket.id}`);

    // Join a room for a specific assessment session
    socket.on("join-session", (sessionId: string) => {
      socket.join(sessionId);
      console.info(`[socket] Client ${socket.id} joined session ${sessionId}`);
    });

    // Handle student progress updates
    socket.on("student-progress", (data: { sessionId: string; learnerId: string; progress: number; currentQuestion: number }) => {
      // Broadcast to all teachers in the session room
      socket.to(data.sessionId).emit("progress-update", data);
    });

    socket.on("disconnect", () => {
      console.info(`[socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
