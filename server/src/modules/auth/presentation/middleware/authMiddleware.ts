import { NextFunction, Response } from "express";
import JWT from "jsonwebtoken";
import { AuthRequest, AuthUser } from "../types/AuthRequest";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

const userRepo = new UserRepository();

export const requireSignIn = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = JWT.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AuthUser;

    if (!decoded._id || decoded.role === undefined) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    const user = await userRepo.getUserById(decoded._id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== 1) {
    return res.status(403).json({ message: "Admin access required" });
  }

  return next();
};
