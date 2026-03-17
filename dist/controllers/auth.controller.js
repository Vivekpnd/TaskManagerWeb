"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.refresh = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = require("../prisma/prismaClient");
const jwt_1 = require("../utils/jwt");
/* REGISTER */
const register = async (req, res) => {
    try {
        const { email, password, name, phone, address } = req.body;
        const existing = await prismaClient_1.prisma.user.findUnique({
            where: { email },
        });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashed = await bcrypt_1.default.hash(password, 10);
        const user = await prismaClient_1.prisma.user.create({
            data: {
                email,
                password: hashed,
                name,
                phone,
                address,
            },
        });
        return res.status(201).json({ message: "Registered", user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Registration failed" });
    }
};
exports.register = register;
/* LOGIN */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prismaClient_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        await prismaClient_1.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return res.json({
            accessToken,
            refreshToken,
            user,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Login failed" });
    }
};
exports.login = login;
/* REFRESH */
const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await prismaClient_1.prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid token" });
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)(user.id);
        return res.json({ accessToken: newAccessToken });
    }
    catch {
        return res.status(403).json({ message: "Expired" });
    }
};
exports.refresh = refresh;
/* GET ME */
const getMe = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await prismaClient_1.prisma.user.findUnique({
            where: { id: userId },
        });
        return res.json(user);
    }
    catch {
        return res.status(500).json({ message: "Error fetching user" });
    }
};
exports.getMe = getMe;
/* LOGOUT */
const logout = async (req, res) => {
    try {
        const { userId } = req.body;
        await prismaClient_1.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return res.json({ message: "Logged out" });
    }
    catch {
        return res.status(500).json({ message: "Logout failed" });
    }
};
exports.logout = logout;
