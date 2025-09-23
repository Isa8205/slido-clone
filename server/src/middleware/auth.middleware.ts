import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET not configured" });
  }

  if (req.cookies["access-token"]) {
    const token = req.cookies["access-token"];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        username: string;
        email: string;
      };
      req.user = decoded;
      next();
    } catch (error) {
      res.clearCookie("access-token", {
        httpOnly: true, 
        secure: true, 
        sameSite: "none" 
      });
      return res.status(401).json({ message: "Invalid or expired token!" });
    }
  }

  res.status(401).json({ message: "No token provided!"})
};
