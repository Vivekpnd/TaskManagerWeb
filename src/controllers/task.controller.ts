import { Request, Response } from "express";
import { prisma } from "../prisma/prismaClient";

/* CREATE TASK */
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const userId = req.userId as string;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
        assignedById: userId,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating task" });
  }
};

/* GET TASKS */
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;

    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const priority = req.query.priority as string | undefined;

    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive" as const,
        },
      }),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where }),
    ]);

    return res.json({
      tasks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching tasks" });
  }
};

/* UPDATE TASK */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.userId as string;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        dueDate: req.body.dueDate
          ? new Date(req.body.dueDate)
          : undefined,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating task" });
  }
};

/* DELETE TASK */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.userId as string;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({
      where: { id },
    });

    return res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting task" });
  }
};

/* TOGGLE TASK */
export const toggleTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.userId as string;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const nextStatus =
      task.status === "pending"
        ? "in-progress"
        : task.status === "in-progress"
        ? "completed"
        : "pending";

    const updated = await prisma.task.update({
      where: { id },
      data: { status: nextStatus },
    });

    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error toggling task" });
  }
};