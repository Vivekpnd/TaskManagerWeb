import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prismaClient";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

/* REGISTER */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, address } = req.body;

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        phone,
        address,
      },
    });

    return res.status(201).json({ message: "Registered", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

/* LOGIN */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return res.json({
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Login failed" });
  }
};

/* REFRESH */
export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const newAccessToken = generateAccessToken(user.id);

    return res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(403).json({ message: "Expired" });
  }
};

/* GET ME */
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return res.json(user);
  } catch {
    return res.status(500).json({ message: "Error fetching user" });
  }
};

/* LOGOUT */
export const logout = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return res.json({ message: "Logged out" });
  } catch {
    return res.status(500).json({ message: "Logout failed" });
  }
};