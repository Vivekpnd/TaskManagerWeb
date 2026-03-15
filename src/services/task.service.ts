import { prisma } from "../prisma";

export const getUserTasks = (userId: string) => {
  return prisma.task.findMany({
    where: { userId },
  });
};

export const createTask = (userId: string, title: string) => {
  return prisma.task.create({
    data: {
      title,
      userId,
    },
  });
};

export const updateTask = (id: string, title: string) => {
  return prisma.task.update({
    where: { id },
    data: { title },
  });
};

export const deleteTask = (id: string) => {
  return prisma.task.delete({
    where: { id },
  });
};

export const toggleTask = async (id: string) => {
  const task = await prisma.task.findUnique({
    where: { id },
  });

  return prisma.task.update({
    where: { id },
    data: { status: !task?.status },
  });
};