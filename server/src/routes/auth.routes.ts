import { Prisma, PrismaClient } from "@prisma/client";
import { Router, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { authMiddleware } from "./../middleware/auth.middleware";

// Extend Express Request type to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/me", authMiddleware, async(req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ user });
});

router.post("/login", async(req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    const user = await prisma.user.findUnique({
        where: { username: username }
    });

    const isLegit = bcrypt.compareSync(password, user?.password || "");

    if (user && isLegit) {
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET!
        );
        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 3600000), 
            httpOnly: true, 
            secure: true, 
            sameSite: "none" 
        });
        res.status(200).json({ message: "User logged in successfully", token });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

router.post("/register", async(req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser: Prisma.UserCreateInput = {
        username,
        email,
        password: hashedPassword
    };

    try {
        const user = await prisma.user.create({ data: newUser });
        console.log("User registered successfully: ", user);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(409).json({ message: "Username or email already exists" });
            }
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/profile", authMiddleware, async(req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ user });
});

export default router;