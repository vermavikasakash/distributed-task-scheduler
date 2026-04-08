"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const enums_1 = require("../../../../shared/enums/enums");
const Task_1 = require("../../../task/domain/entities/Task");
const Worker_1 = require("./Worker");
const createTask = () => {
    const task = new Task_1.Task("task-1", {
        firstName: "Test",
        phone: "9999999999",
        notes: "test task",
    });
    task.queue();
    return task;
};
(0, node_test_1.default)("worker requeues a task after a retryable failure", async () => {
    const persistedStatuses = [];
    const worker = new Worker_1.Worker("W1", {
        createTaskRecord: async (task) => {
            persistedStatuses.push(task.status);
        },
    });
    const originalRandom = Math.random;
    Math.random = () => 0.1;
    try {
        const task = createTask();
        const result = await worker.process(task);
        strict_1.default.equal(result, Worker_1.WorkerProcessResult.REQUEUED);
        strict_1.default.equal(task.status, enums_1.TaskStatus.RETRY);
        strict_1.default.equal(task.retryCount, 1);
        strict_1.default.equal(worker.isBusy, false);
        strict_1.default.deepEqual(persistedStatuses, [
            enums_1.TaskStatus.PROCESSING,
            enums_1.TaskStatus.RETRY,
        ]);
        strict_1.default.ok(task.nextRetryAt > Date.now());
    }
    finally {
        Math.random = originalRandom;
    }
});
(0, node_test_1.default)("worker marks a task as failed after the final retry", async () => {
    const persistedStatuses = [];
    const worker = new Worker_1.Worker("W1", {
        createTaskRecord: async (task) => {
            persistedStatuses.push(task.status);
        },
    });
    const originalRandom = Math.random;
    Math.random = () => 0.1;
    try {
        const task = createTask();
        task.retryCount = task.maxRetries - 1;
        const result = await worker.process(task);
        strict_1.default.equal(result, Worker_1.WorkerProcessResult.FAILED);
        strict_1.default.equal(task.status, enums_1.TaskStatus.FAILED);
        strict_1.default.equal(task.retryCount, task.maxRetries);
        strict_1.default.deepEqual(persistedStatuses, [
            enums_1.TaskStatus.PROCESSING,
            enums_1.TaskStatus.FAILED,
        ]);
        strict_1.default.equal(worker.isBusy, false);
    }
    finally {
        Math.random = originalRandom;
    }
});
(0, node_test_1.default)("worker persists the final completed status after successful processing", async () => {
    const persistedStatuses = [];
    const worker = new Worker_1.Worker("W1", {
        createTaskRecord: async (task) => {
            persistedStatuses.push(task.status);
        },
    });
    const originalRandom = Math.random;
    Math.random = () => 0.9;
    try {
        const task = createTask();
        const result = await worker.process(task);
        strict_1.default.equal(result, Worker_1.WorkerProcessResult.COMPLETED);
        strict_1.default.equal(task.status, enums_1.TaskStatus.COMPLETED);
        strict_1.default.deepEqual(persistedStatuses, [
            enums_1.TaskStatus.PROCESSING,
            enums_1.TaskStatus.COMPLETED,
        ]);
        strict_1.default.equal(worker.isBusy, false);
    }
    finally {
        Math.random = originalRandom;
    }
});
