"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTask = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const taskService = __importStar(require("../services/task.service"));
const getTasks = async (req, res) => {
    const tasks = await taskService.getUserTasks(req.user.userId);
    res.json(tasks);
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    const { title } = req.body;
    const task = await taskService.createTask(req.user.userId, title);
    res.json(task);
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    const { title } = req.body;
    const task = await taskService.updateTask(req.params.id, title);
    res.json(task);
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    await taskService.deleteTask(req.params.id);
    res.json({ message: "Task deleted" });
};
exports.deleteTask = deleteTask;
const toggleTask = async (req, res) => {
    const task = await taskService.toggleTask(req.params.id);
    res.json(task);
};
exports.toggleTask = toggleTask;
