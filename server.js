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
  console.log("🟢 Nuevo usuario conectado");

  socket.on("entrar", (nombre) => {
    socket.username = nombre;
    io.emit("mensaje", { nombre: "Sistema", texto: `${nombre} entró al chat` });
  });

  socket.on("mensaje", (data) => {
    io.emit("mensaje", data);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("mensaje", { nombre: "Sistema", texto: `${socket.username} salió del chat` });
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
