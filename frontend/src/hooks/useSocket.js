import { useEffect, useRef, useState } from "react";

export default function useSocket(url = "http://localhost:5001") {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Socket.IO is optional.
    // If socket.io-client is installed, this hook can be connected later.
    let socket;

    const connectSocket = async () => {
      try {
        const { io } = await import("socket.io-client");

        socket = io(url, {
          transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          setConnected(true);
        });

        socket.on("disconnect", () => {
          setConnected(false);
        });
      } catch (error) {
        console.warn("Socket connection unavailable:", error.message);
        setConnected(false);
      }
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }

      socketRef.current = null;
      setConnected(false);
    };
  }, [url]);

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    connected,
    emit,
    on,
    off,
  };
}