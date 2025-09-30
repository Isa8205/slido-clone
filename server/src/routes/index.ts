import { Router } from "express";
import authRoutes from "./auth.routes";
import roomRoutes from "./room.routes";
import quizRoutes from "./quiz.routes";

const router = Router()

router.use("/auth", authRoutes)
router.use("/room", roomRoutes)
router.use("/quiz", quizRoutes)

export default router;