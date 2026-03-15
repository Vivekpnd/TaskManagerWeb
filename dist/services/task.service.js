"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTask = exports.deleteTask = exports.updateTask = exports.createTask = exports.getUserTasks = void 0;
const prisma_1 = require("../prisma");
const getUserTasks = (userId) => {
    return prisma_1.prisma.task.findMany({
        where: { userId },
    });
};
exports.getUserTasks = getUserTasks;
const createTask = (userId, title) => {
    return prisma_1.prisma.task.create({
        data: {
            title,
            userId,
        },
    });
};
exports.createTask = createTask;
const updateTask = (id, title) => {
    return prisma_1.prisma.task.update({
        where: { id },
        data: { title },
    });
};
exports.updateTask = updateTask;
const deleteTask = (id) => {
    return prisma_1.prisma.task.delete({
        where: { id },
    });
};
exports.deleteTask = deleteTask;
const toggleTask = async (id) => {
    const task = await prisma_1.prisma.task.findUnique({
        where: { id },
    });
    return prisma_1.prisma.task.update({
        where: { id },
        data: { status: !task?.status },
    });
};
exports.toggleTask = toggleTask;
