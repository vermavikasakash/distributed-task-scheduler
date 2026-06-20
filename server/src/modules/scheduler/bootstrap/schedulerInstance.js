const { TaskRepository } = require("../../task/infrastructure/repositories/TaskRepository");
const { eventBus } = require("../domain/events/EventBus");
const { Worker } = require("../domain/entities/Worker");
const { TaskQueue } = require("../domain/queue/TaskQueue");
const { Scheduler } = require("../domain/services/Scheduler");
const { WorkerRunner } = require("../domain/services/WorkerRunner");

/**
 * Scheduler Bootstrap
 * Initializes and configures the task scheduling system
 */

// Create task queue for in-memory task management
const taskQueue = new TaskQueue();

// Create task repository for persistence
const taskRepository = new TaskRepository();

// Create worker instances (agents)
// Each worker can process tasks independently
const workers = [
  new Worker("W1", taskRepository),
  new Worker("W2", taskRepository),
];

// Bind workers to event bus for processing
// Each WorkerRunner listens for task assignments
workers.forEach((worker) => new WorkerRunner(worker, taskQueue));

// Create scheduler with queue and workers
const scheduler = new Scheduler(taskQueue, workers);

// Listen for task completion events to trigger next assignment
eventBus.on("taskCompleted", () => {
  scheduler.schedule();
});

module.exports = { taskQueue, scheduler, workers };
