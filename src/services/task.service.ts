import { prisma } from "../prisma/prismaClient";

export const createTaskService = async (title: string, userId: string) => {
  return prisma.task.create({
    data: {
      title,
      userId,
      assignedById: userId,
    },
  });
};

export const getTasksService = async (userId: string) => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const deleteTaskService = async (id: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return prisma.task.delete({
    where: { id },
  });
};

export const toggleTaskService = async (id: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const nextStatus =
    task.status === "pending"
      ? "in-progress"
      : task.status === "in-progress"
      ? "completed"
      : "pending";

  return prisma.task.update({
    where: { id },
    data: { status: nextStatus },
  });
};