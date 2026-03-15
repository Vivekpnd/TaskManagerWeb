import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/task.controller";

const router = express.Router();

router.get("/", authenticate, getTasks);
router.post("/", authenticate, createTask);
router.patch("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);
router.patch("/:id/toggle", authenticate, toggleTask);

export default router;