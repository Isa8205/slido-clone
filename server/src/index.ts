import { Express } from "express";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors"
import cookieParser from "cookie-parser"
import redis from "./lib/redisClient";
import  Jwt  from "jsonwebtoken";
import "dotenv/config";



import router from "./routes";

const JWT_SECRET = process.env.JWT_SECRET
const app: Express = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  "http://172.16.95.214:5173"
  
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

io.on("connection", (socket) => {
  socket.data.username = "Anonymous"
  console.log(`User connected: ${socket.id}`);

  socket.on("join-room", data => {
    const roomToken = data.roomToken
    const roomSessionData = Jwt.verify(roomToken, JWT_SECRET!, { ignoreExpiration: true}) as { username: string, roomCode: string }
    socket.data.username = roomSessionData.username
    const roomCode = data.roomCode
    socket.join(roomCode);
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

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
