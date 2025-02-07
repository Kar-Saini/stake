import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.body;
  console.log(token);
  if (!token) {
    res.json({ message: "Unauthenticated" }).status(403);
  }
  try {
    const decoded = jwt.verify(token, "secret") as JwtPayload & {
      id: string;
      role: "admin" | "user";
    };
    console.log(decoded);
    req.id = decoded.id;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.log(error);
    res.json({ message: "Invalid token" }).status(403);
  }
}

declare global {
  namespace Express {
    export interface Request {
      role?: "admin" | "user";
      id: string;
    }
  }
}
