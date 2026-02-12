const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("🟢 Usuario conectado:", socket.id);

  socket.on("join-room", () => {
    socket.join("sala");
    socket.to("sala").emit("user-connected", socket.id);
  });

  socket.on("signal", (data) => {
    io.to(data.to).emit("signal", {
      from: socket.id,
      signal: data.signal
    });
  });

  socket.on("disconnect", () => {
    socket.to("sala").emit("user-disconnected", socket.id);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Servidor WebRTC corriendo");
});
