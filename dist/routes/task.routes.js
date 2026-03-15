"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const task_controller_1 = require("../controllers/task.controller");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.authenticate, task_controller_1.getTasks);
router.post("/", auth_middleware_1.authenticate, task_controller_1.createTask);
router.patch("/:id", auth_middleware_1.authenticate, task_controller_1.updateTask);
router.delete("/:id", auth_middleware_1.authenticate, task_controller_1.deleteTask);
router.patch("/:id/toggle", auth_middleware_1.authenticate, task_controller_1.toggleTask);
exports.default = router;
