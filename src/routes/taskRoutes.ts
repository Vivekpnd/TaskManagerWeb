import express from "express";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTask
} from "../controllers/task.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

router.patch("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

router.patch("/:id/toggle", authMiddleware, toggleTask);

export default router;