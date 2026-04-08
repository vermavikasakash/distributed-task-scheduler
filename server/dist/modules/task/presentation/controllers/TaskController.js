"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStatsController = exports.getAllTasksController = exports.updateTaskStatusController = exports.createTaskController = void 0;
const TaskService_1 = require("../../application/services/TaskService");
const TaskRepository_1 = require("../../infrastructure/repositories/TaskRepository");
const taskRepo = new TaskRepository_1.TaskRepository();
const taskService = new TaskService_1.TaskService();
const isTaskRecordStatus = (value) => value === "completed" || value === "failed";
const toTaskResponse = (taskRecord) => {
    var _a, _b;
    const plainTask = typeof (taskRecord === null || taskRecord === void 0 ? void 0 : taskRecord.toObject) === "function"
        ? taskRecord.toObject()
        : taskRecord;
    return Object.assign(Object.assign({}, plainTask), { currentStatus: (_b = (_a = plainTask.internalStatus) !== null && _a !== void 0 ? _a : plainTask.status) !== null && _b !== void 0 ? _b : "QUEUED" });
};
const createTaskController = async (req, res) => {
    try {
        const { tasks } = req.body;
        await taskService.createTasks(tasks);
        return res.status(202).json({
            status: true,
            success: true,
            message: "Tasks are being processed",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in task creation",
        });
    }
};
exports.createTaskController = createTaskController;
const updateTaskStatusController = async (req, res) => {
    try {
        const { status } = req.body;
        if (!isTaskRecordStatus(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const taskId = req.params.id;
        if (typeof taskId !== "string") {
            return res.status(400).json({ message: "Invalid task id" });
        }
        const task = await taskRepo.getTasksByTaskId(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await taskRepo.updateTaskStatus(taskId, status);
        return res.status(200).json({
            status: true,
            success: true,
            message: "Task updated",
        });
    }
    catch (_a) {
        return res.status(500).json({ message: "Error updating task" });
    }
};
exports.updateTaskStatusController = updateTaskStatusController;
const getAllTasksController = async (req, res) => {
    try {
        const tasks = await taskRepo.getAllTasks();
        return res.status(200).send({
            status: true,
            success: true,
            message: "Tasks fetched successfully",
            task: tasks.map(toTaskResponse),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Can't fetch tasks",
            error,
        });
    }
};
exports.getAllTasksController = getAllTasksController;
const getDashboardStatsController = async (req, res) => {
    try {
        const totalTasks = await taskRepo.countTasks();
        return res.status(200).json({
            status: true,
            success: true,
            data: {
                totalTasks,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching dashboard stats",
        });
    }
};
exports.getDashboardStatsController = getDashboardStatsController;
