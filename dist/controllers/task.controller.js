"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTask = exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const prismaClient_1 = require("../prisma/prismaClient");
/* CREATE TASK */
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;
        const userId = req.userId;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const task = await prismaClient_1.prisma.task.create({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating task" });
    }
};
exports.createTask = createTask;
/* GET TASKS */
const getTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search;
        const status = req.query.status;
        const priority = req.query.priority;
        const skip = (page - 1) * limit;
        const where = {
            userId,
            ...(status && { status }),
            ...(priority && { priority }),
            ...(search && {
                title: {
                    contains: search,
                    mode: "insensitive",
                },
            }),
        };
        const [tasks, total] = await Promise.all([
            prismaClient_1.prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prismaClient_1.prisma.task.count({ where }),
        ]);
        return res.json({
            tasks,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching tasks" });
    }
};
exports.getTasks = getTasks;
/* UPDATE TASK */
const updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const task = await prismaClient_1.prisma.task.findFirst({
            where: { id, userId },
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const updated = await prismaClient_1.prisma.task.update({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating task" });
    }
};
exports.updateTask = updateTask;
/* DELETE TASK */
const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const task = await prismaClient_1.prisma.task.findFirst({
            where: { id, userId },
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await prismaClient_1.prisma.task.delete({
            where: { id },
        });
        return res.json({ message: "Task deleted" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting task" });
    }
};
exports.deleteTask = deleteTask;
/* TOGGLE TASK */
const toggleTask = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const task = await prismaClient_1.prisma.task.findFirst({
            where: { id, userId },
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const nextStatus = task.status === "pending"
            ? "in-progress"
            : task.status === "in-progress"
                ? "completed"
                : "pending";
        const updated = await prismaClient_1.prisma.task.update({
            where: { id },
            data: { status: nextStatus },
        });
        return res.json(updated);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error toggling task" });
    }
};
exports.toggleTask = toggleTask;
