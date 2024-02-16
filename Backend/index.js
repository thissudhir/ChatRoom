import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const connectedUsers = [];
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("addUser", (username) => {
    connectedUsers.push({ id: socket.id, username });
    io.emit(
      "users",
      connectedUsers.map((user) => user.username)
    );
  });

  socket.on("chatMessage", (data) => {
    const { username, message } = data;
    console.log(`Message from ${username}: ${message}`);
    io.emit("chatMessage", { username, message });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    const index = connectedUsers.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
      io.emit(
        "users",
        connectedUsers.map((user) => user.username)
      );
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
