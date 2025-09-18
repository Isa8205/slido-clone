import { Router } from "express";

const router = Router();

router.post("/create", (req, res) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log(`Room code generated: ${roomCode}`);
    // Here you would typically save the room to your database
    res.status(201).json({ message: "Room created successfully", roomCode });
})

router.post("/join/:roomCode", (req, res) => {
    const { roomCode } = req.params;
    if (!roomCode) {
        return res.status(400).json({ message: "Room code is required" });
    }
    console.log(`Attempt to join room: ${roomCode}`);
    // Here you would typically check if the room exists in your database
    const roomExists = true; // Placeholder logic
    if (roomExists) {
        res.status(200).json({ message: "Joined room successfully", roomCode });
    } else {
        res.status(404).json({ message: "Room not found" });
    }
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