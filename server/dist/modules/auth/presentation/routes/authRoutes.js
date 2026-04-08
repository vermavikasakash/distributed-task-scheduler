"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const TaskController_1 = require("../../../task/presentation/controllers/TaskController");
exports.router = express_1.default.Router();
exports.router.post("/register", authController_1.registerController);
exports.router.post("/login", authController_1.loginController);
exports.router.get("/user-auth", authMiddleware_1.requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});
exports.router.post("/createTask", authMiddleware_1.requireSignIn, authMiddleware_1.isAdmin, TaskController_1.createTaskController);
exports.router.patch("/task/:id/status", authMiddleware_1.requireSignIn, authMiddleware_1.isAdmin, TaskController_1.updateTaskStatusController);
exports.router.get("/get", authMiddleware_1.requireSignIn, authMiddleware_1.isAdmin, authController_1.testController);
exports.router.get("/getTasks", authMiddleware_1.requireSignIn, authMiddleware_1.isAdmin, TaskController_1.getAllTasksController);
exports.router.get("/dashboard-stats", authMiddleware_1.requireSignIn, authMiddleware_1.isAdmin, TaskController_1.getDashboardStatsController);
