"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const enums_1 = require("../../../../shared/enums/enums");
const TaskModel_1 = require("../models/TaskModel");
class TaskRepository {
    getTerminalStatus(task) {
        if (task.status === enums_1.TaskStatus.COMPLETED) {
            return "completed";
        }
        if (task.status === enums_1.TaskStatus.FAILED) {
            return "failed";
        }
        return null;
    }
    async createTaskRecord(task) {
        const terminalStatus = this.getTerminalStatus(task);
        await TaskModel_1.TaskModel.findOneAndUpdate({ taskId: task.id }, {
            $set: Object.assign({ firstName: task.payload.firstName, phone: task.payload.phone, notes: task.payload.notes, taskId: task.id, retryCount: task.retryCount, internalStatus: task.status }, (terminalStatus ? { status: terminalStatus } : {})),
        }, {
            upsert: true,
            returnDocument: "after",
            runValidators: true,
        });
    }
    async updateTaskStatus(taskId, status) {
        const internalStatus = status === "completed" ? enums_1.TaskStatus.COMPLETED : enums_1.TaskStatus.FAILED;
        return TaskModel_1.TaskModel.findByIdAndUpdate(taskId, { status, internalStatus }, { returnDocument: "after" });
    }
    async getAllTasks() {
        return TaskModel_1.TaskModel.find({});
    }
    async countTasks() {
        return TaskModel_1.TaskModel.countDocuments();
    }
    async getTaskById(taskId) {
        return TaskModel_1.TaskModel.findById(taskId);
    }
}
exports.TaskRepository = TaskRepository;
