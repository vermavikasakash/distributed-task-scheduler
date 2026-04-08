"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const uuid_1 = require("uuid");
const schedulerInstance_1 = require("../../../scheduler/bootstrap/schedulerInstance");
const Task_1 = require("../../domain/entities/Task");
const TaskRepository_1 = require("../../infrastructure/repositories/TaskRepository");
class TaskService {
    constructor(taskRepo = new TaskRepository_1.TaskRepository()) {
        this.taskRepo = taskRepo;
    }
    async createTasks(tasks) {
        const taskObjects = tasks.map((taskPayload) => {
            const task = new Task_1.Task((0, uuid_1.v4)(), taskPayload);
            task.queue();
            return task;
        });
        console.log("Tasks added:", taskObjects.length);
        await Promise.all(taskObjects.map((task) => this.taskRepo.createTaskRecord(task)));
        schedulerInstance_1.taskQueue.enqueueBulk(taskObjects);
        schedulerInstance_1.scheduler.schedule();
    }
}
exports.TaskService = TaskService;
