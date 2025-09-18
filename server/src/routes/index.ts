import { Router } from "express";
import authRoutes from "./auth.routes";
import roomRoutes from "./room.routes";

const router = Router()

router.use("/auth", authRoutes)
router.use("/room", roomRoutes)

export default router;