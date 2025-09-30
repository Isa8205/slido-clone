import { Express } from "express";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors"
import cookieParser from "cookie-parser"
import  Jwt  from "jsonwebtoken";
import "dotenv/config";

import router from "./routes";
import redisClient from "./lib/redisClient";
import { error } from "console";

const JWT_SECRET = process.env.JWT_SECRET
const app: Express = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  "http://10.230.198.32:5173",
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
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", async(socket) => {
  socket.data.username = "Anonymous"
  console.log(`User connected: ${socket.id}`);
  await redisClient.sAdd("online:users", String(socket.id))

  socket.on("join-room", async(data) => {
    const roomToken = data.token
    if (!roomToken) {
      socket.send({error: "Room token should be provided"})
      return
    }
    const roomSessionData = Jwt.verify(roomToken, JWT_SECRET!, { ignoreExpiration: true}) as { username: string, roomCode: string }
    socket.data.username = roomSessionData.username
    const roomCode = data.roomCode
    socket.join(roomCode);
    socket.send({ success: true})
    await redisClient.sAdd(`room:${roomCode}:participants`, String(socket.id))
    console.log(`${socket.data.username} joined room ${roomCode}`);
  });

  socket.on("leave-room", (roomCode) => {
    socket.leave(roomCode)
    socket.data.username = "Anonymous"
    console.log(`${socket.data.username} left room ${roomCode}`);
  })

  socket.on("close-room", (roomCode) => {
    socket.leave(roomCode);
    io.to(roomCode).emit("room-closed")
    io.socketsLeave(roomCode) // <-- Kicks everyone out and closes room
    console.log(`Host ${socket.id} closed room ${roomCode}`);
  })

  socket.on("disconnect", async(roomCode) => {
    console.log(`User disconnected: ${socket.id}`);
    
    for (let room of socket.rooms) {
      if (room !== socket.id) {
        console.log(`${socket.id} was in room ${room}`)

        socket.to(room).emit("user-left", { socketId: socket.id })
      }
    }
    await redisClient.sRem(`room:${roomCode}:participants`, String(socket.id))
    await redisClient.sRem("online:users", String(socket.id))
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
