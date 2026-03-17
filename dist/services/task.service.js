"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTaskService = exports.deleteTaskService = exports.getTasksService = exports.createTaskService = void 0;
const prismaClient_1 = require("../prisma/prismaClient");
const createTaskService = async (title, userId) => {
    return prismaClient_1.prisma.task.create({
        data: {
            title,
            userId,
            assignedById: userId,
        },
    });
};
exports.createTaskService = createTaskService;
const getTasksService = async (userId) => {
    return prismaClient_1.prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
};
exports.getTasksService = getTasksService;
const deleteTaskService = async (id, userId) => {
    const task = await prismaClient_1.prisma.task.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!task) {
        throw new Error("Task not found");
    }
    return prismaClient_1.prisma.task.delete({
        where: { id },
    });
};
exports.deleteTaskService = deleteTaskService;
const toggleTaskService = async (id, userId) => {
    const task = await prismaClient_1.prisma.task.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!task) {
        throw new Error("Task not found");
    }
    const nextStatus = task.status === "pending"
        ? "in-progress"
        : task.status === "in-progress"
            ? "completed"
            : "pending";
    return prismaClient_1.prisma.task.update({
        where: { id },
        data: { status: nextStatus },
    });
};
exports.toggleTaskService = toggleTaskService;
