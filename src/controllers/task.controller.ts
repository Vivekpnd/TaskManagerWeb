import { Response } from "express";
import { prisma } from "../prisma/prismaClient";
import { AuthRequest } from "../middleware/auth.middleware";

/* ================= CREATE TASK ================= */

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        userId: req.userId as string
      }
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
};

/* ================= GET TASKS ================= */

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const skip = (page - 1) * limit;

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.userId as string,

        ...(status !== undefined && {
          status: status === "true"
        }),

        ...(search && {
          title: {
            contains: search,
            mode: "insensitive"
          }
        })
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    });

    const total = await prisma.task.count({
      where: {
        userId: req.userId as string
      }
    });

    res.json({
      tasks,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

/* ================= UPDATE TASK ================= */

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title } = req.body;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId as string
      }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title }
    });

    res.json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

/* ================= DELETE TASK ================= */

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId as string
      }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({
      where: { id }
    });

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
};

/* ================= TOGGLE TASK ================= */

export const toggleTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId as string
      }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status: !task.status
      }
    });

    res.json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: "Error toggling task status" });
  }
};