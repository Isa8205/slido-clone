import { authMiddleware } from "@/middleware/auth.middleware";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient()

router.get("/all", authMiddleware, async(req, res) => {
    try {
        const quizSets = await prisma.quizSet.findMany()
        
        res.status(200).json(quizSets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.post("/create", async(req, res) => {
    try {
        const { title, desctiption } = req.body;
        
        const quizSet = await prisma.quizSet.create({
            data: {
                title,
                note: desctiption,
            }
        })
        res.status(201).json({ message: "Quiz created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;