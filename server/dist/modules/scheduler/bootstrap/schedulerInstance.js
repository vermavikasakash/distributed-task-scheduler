"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduler = exports.taskQueue = void 0;
const TaskRepository_1 = require("../../task/infrastructure/repositories/TaskRepository");
const EventBus_1 = require("../domain/events/EventBus");
const Worker_1 = require("../domain/entities/Worker");
const TaskQueue_1 = require("../domain/queue/TaskQueue");
const Scheduler_1 = require("../domain/services/Scheduler");
const WorkerRunner_1 = require("../domain/services/WorkerRunner");
exports.taskQueue = new TaskQueue_1.TaskQueue();
const taskRepository = new TaskRepository_1.TaskRepository();
const workers = [
    new Worker_1.Worker("W1", taskRepository),
    new Worker_1.Worker("W2", taskRepository),
];
workers.forEach((worker) => new WorkerRunner_1.WorkerRunner(worker, exports.taskQueue));
exports.scheduler = new Scheduler_1.Scheduler(exports.taskQueue, workers);
EventBus_1.eventBus.on("taskCompleted", () => {
    exports.scheduler.schedule();
});
