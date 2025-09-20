import { authMiddleware } from "../middleware/auth.middleware";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from 'jsonwebtoken'

const router = Router();
const prisma = new PrismaClient
const JWT_SECRET = process.env.JWT_SECRET

router.post("/create", authMiddleware, async(req, res) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const user = req.user

    if (!user) {
        return res.status(401).json({ message: "Please login to create a room" })
    }

    const room = await prisma.room.create({
        data: {
            code: roomCode,
            owner: {
                connect: {
                    username: user.username
                }
            }
        }
    })

    res.status(201).json({ message: "Room created successfully", roomCode: room.code });
})

router.get("/ping/:roomCode", async(req, res) => {
    const { roomCode } = req.params;

    const room = await prisma.room.findFirst({ where: { code: roomCode } })
    if (room) {
        if (room.endedAt) {
            return res.status(302).json({ message: "The room has ended" })
        }
        return res.status(200).json({ message: "Room is active"})
    }
    
    res.status(404).json({ message: "The room does not exist" })
})

router.post("/join/:roomCode", async(req, res) => {
    const { roomCode } = req.params;
    const username = req.body.username

    if (!roomCode) {
        return res.status(400).json({ message: "Room code is required" });
    }

    const room = await prisma.room.findFirst({ where: {code: roomCode}})
    if (room) {
        if (room.endedAt) {
            return res.json({ message: "The room has ended"})
        }
        
        const roomSessionData = {
            username: username,
            roomCode: roomCode
        }
        const roomToken = jwt.sign(roomSessionData, JWT_SECRET!, { expiresIn: '1h' })
        res.cookie("room-token", roomToken, { httpOnly: true })
        res.status(200).json({ message: "Joined room successfully", roomCode });
    } else {
        res.status(404).json({ message: "Room not found" });
    }
})

router.post("/set-questions/:roomCode", authMiddleware, async(req, res) => {
    const quizset = req.body.quizset
    const { roomCode } = req.params
    
    const room = await prisma.room.findFirst({ where: { code: roomCode }, include: { owner: true } })
    if (!room) {
        return res.status(404).json({ message: "The room was not found. Check again" })
    } else if (room.owner && room.owner.username !== req.user.username) {
        return res.status(401).json({ message: "Failed, you can only modify your own rooms!"})
    }
    const result = await prisma.quizSet.create({
        data: {
            quizzes: `${JSON.stringify(quizset)}`,
            room: {
                connect: {
                    code: roomCode
                }
            }
        }
    })
    res.status(200).json({ message: "Questions set successfully", result })
})

router.get("/results/:roomCode", (req, res) => {
    const { roomCode } = req.params;
    if (!roomCode) {
        return res.status(400).json({ message: "Room code is required" });
    };

    const resData = {
        roomCode,
        results: [
            {
                question: "What is the capital of France?",
                answer: "Paris",
                percentage: 50,
            },
            {
                question: "What is the capital of Italy?",
                answer: "Rome",
                percentage: 30,
            },
            {
                question: "What is the capital of Germany?",
                answer: "Berlin",
                percentage: 20,
            },
        ]
    }
    
    res.status(200).json(resData)
})

export default router;