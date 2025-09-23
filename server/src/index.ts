import { Express } from "express";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors"
import cookieParser from "cookie-parser"

import router from "./routes";

const app: Express = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  "http://192.168.88.67:5173"
  
]

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true
}))

app.use((req, res, next) => {
  // Custom logger
  const origin = req.headers.origin;
  const date = new Date()
  console.log(`[${date.toISOString()}] - ${req.method} ${origin} ${req.url}`)
  next()
})

// Use the imported router for API routes
app.use('/api', router);

// Simple route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const activeRooms = new Set()
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-room", (roomCode) => {
    if (!activeRooms.has(roomCode)) {
      return
    }
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room ${roomCode}`);
  });

  socket.on("open-room", (roomCode) => {
    activeRooms.add(roomCode)
    socket.join(roomCode);
    console.log(`Host ${socket.id} created room ${roomCode}`);
  });

  socket.on("close-room", (roomCode) => {
    activeRooms.delete(roomCode)
    socket.leave(roomCode);
    io.to(roomCode).emit("room-closed")
    io.socketsLeave(roomCode) // <-- Kicks everyone out and closes room
    console.log(`Host ${socket.id} closed room ${roomCode}`);
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
