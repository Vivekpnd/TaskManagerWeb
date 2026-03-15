import { Request, Response } from "express";
import * as taskService from "../services/task.service";

export const getTasks = async (req: any, res: Response) => {
  const tasks = await taskService.getUserTasks(req.user.userId);
  res.json(tasks);
};

export const createTask = async (req: any, res: Response) => {
  const { title } = req.body;

  const task = await taskService.createTask(req.user.userId, title);

  res.json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const { title } = req.body;

  const task = await taskService.updateTask(req.params.id, title);

  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  await taskService.deleteTask(req.params.id);

  res.json({ message: "Task deleted" });
};

export const toggleTask = async (req: Request, res: Response) => {
  const task = await taskService.toggleTask(req.params.id);

  res.json(task);
};