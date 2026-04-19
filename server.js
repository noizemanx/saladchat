const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let usuarios = {};

io.on("connection", (socket) => {
  console.log("🟢 Usuario conectado:", socket.id);

  socket.on("join-room", (nombre) => {
    usuarios[socket.id] = nombre;
    socket.nombre = nombre;

    io.emit("lista-usuarios", usuarios);
  });

  socket.on("mensaje", (data) => {
    io.emit("mensaje", data);
  });

  // 🔥 SOLICITAR CAMARA
  socket.on("solicitar-cam", (to) => {
    io.to(to).emit("solicitud-cam", {
      from: socket.id,
      nombre: socket.nombre
    });
  });

  // 🔥 RESPUESTA CAMARA
  socket.on("respuesta-cam", (data) => {
    io.to(data.to).emit("respuesta-cam", {
      from: socket.id,
      aceptado: data.aceptado
    });
  });

  // 🔥 WEBRTC SIGNAL
  socket.on("signal", (data) => {
    io.to(data.to).emit("signal", {
      from: socket.id,
      signal: data.signal
    });
  });

  socket.on("disconnect", () => {
    delete usuarios[socket.id];
    io.emit("lista-usuarios", usuarios);
    io.emit("user-disconnected", socket.id);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("🔥 Server PRO corriendo");
});
