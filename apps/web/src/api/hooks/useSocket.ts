import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
      console.info("[socket] Connected to server");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const joinSession = (sessionId: string) => {
    socketRef.current?.emit("join-session", sessionId);
  };

  const updateProgress = (data: { sessionId: string; learnerId: string; progress: number; currentQuestion: number }) => {
    socketRef.current?.emit("student-progress", data);
  };

  const onProgressUpdate = (callback: (data: any) => void) => {
    socketRef.current?.on("progress-update", callback);
  };

  return {
    socket: socketRef.current,
    joinSession,
    updateProgress,
    onProgressUpdate
  };
};
