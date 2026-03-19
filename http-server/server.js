import net from "net";
import { reqParser } from "./request.js";

export const server = net.createServer((socket) => {
  console.log("Client connected");
  socket.setEncoding("utf8");

  socket.on("data", (data) => {
    const parsedReq = reqParser(data);
    console.log(parsedReq);
  });
  socket.on("end", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});
