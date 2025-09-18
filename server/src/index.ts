import { Express } from "express";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import router from "./routes";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the imported router for API routes
app.use('/api', router);

// Simple route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (roomCode) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room ${roomCode}`);
  });

  socket.on("hostRoom", (roomCode) => {
    socket.join(roomCode);
    console.log(`Host ${socket.id} created room ${roomCode}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
