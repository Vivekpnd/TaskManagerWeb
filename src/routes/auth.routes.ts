import express from "express";
import {
  login,
  register,
  refresh,
  logout,
  getMe,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);


router.get("/me", authMiddleware, getMe);

export default router;