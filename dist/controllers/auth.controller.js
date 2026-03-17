"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../prisma");
const jwt_1 = require("../utils/jwt");
/* ================= REGISTER ================= */
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existing = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: { email, password: hashedPassword },
        });
        res.status(201).json(user);
    }
    catch {
        res.status(500).json({ message: "Registration failed" });
    }
};
exports.register = register;
/* ================= LOGIN ================= */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        // store refresh token (IMPORTANT)
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        res.json({ accessToken, refreshToken });
    }
    catch {
        res.status(500).json({ message: "Login failed" });
    }
};
exports.login = login;
/* ================= REFRESH ================= */
const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)(user.id);
        res.json({ accessToken: newAccessToken });
    }
    catch {
        res.status(403).json({ message: "Token expired" });
    }
};
exports.refresh = refresh;
/* ================= LOGOUT ================= */
const logout = async (req, res) => {
    const { userId } = req.body;
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
    res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
