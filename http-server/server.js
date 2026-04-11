import net from "net";
import { handle } from "./app.js";

export const server = net.createServer((socket) => {
  console.log("Client connected");
  socket.setEncoding("utf8");

  const context = {
    socket: socket,
    ip: socket.remoteAddress,
  };

  socket.on("data", (data) => {
    handle(data, context);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});
