import { io } from "socket.io-client";

export const socket = io(`http://localhost:8000`, {
  transports: ["websocket"],
  autoConnect: false,
});

export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const emit = (event, ...args) => {
  socket.emit(event, ...args);
};

export const on = (event, callback) => {
  socket.on(event, callback);
};

export const off = (event) => {
  socket.off(event);
};
