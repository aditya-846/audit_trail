import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5001";

let socket = null;

export function connectSocket(
  token
) {
  if (socket?.connected) {
    return socket;
  }

  socket = io(
    SOCKET_URL,
    {
      transports: [
        "websocket",
      ],

      auth: {
        token,
      },

      reconnection: true,

      reconnectionAttempts: 10,

      reconnectionDelay: 1000,

      reconnectionDelayMax: 5000,
    }
  );

  socket.on("connect", () => {
    console.log(
      "WebSocket connected:",
      socket.id
    );
  });

  socket.on("disconnect", () => {
    console.log(
      "WebSocket disconnected"
    );
  });

  socket.on(
    "connect_error",
    (error) => {
      console.error(
        "WebSocket error:",
        error.message
      );
    }
  );

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

export function isSocketConnected() {
  return Boolean(
    socket?.connected
  );
}

export function emit(
  eventName,
  data
) {
  if (!socket) {
    console.warn(
      "Socket is not initialized."
    );

    return;
  }

  socket.emit(
    eventName,
    data
  );
}

export function subscribe(
  eventName,
  callback
) {
  if (!socket) {
    console.warn(
      "Socket is not initialized."
    );

    return () => {};
  }

  socket.on(
    eventName,
    callback
  );

  return () => {
    socket.off(
      eventName,
      callback
    );
  };
}

export function subscribeToAuditEvents(
  callback
) {
  return subscribe(
    "audit:event",
    callback
  );
}

export function subscribeToShipmentUpdates(
  callback
) {
  return subscribe(
    "shipment:updated",
    callback
  );
}

export function subscribeToSensorData(
  callback
) {
  return subscribe(
    "sensor:data",
    callback
  );
}

export default {
  connectSocket,
  disconnectSocket,
  getSocket,
  isSocketConnected,
  emit,
  subscribe,
  subscribeToAuditEvents,
  subscribeToShipmentUpdates,
  subscribeToSensorData,
};cd "C:\Users\ADMIN\Desktop\pull from github\audit_trail\frontend"
npm run dev