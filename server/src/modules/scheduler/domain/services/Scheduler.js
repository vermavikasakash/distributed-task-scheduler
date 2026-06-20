const { RoundRobinStrategy } = require("./AssignmentStrategy");
const { eventBus } = require("../events/EventBus");
const { TaskStatus } = require("../../../../shared/enums/enums");

/**
 * Scheduler - Main task scheduling orchestrator
 * Assigns queued tasks to available workers using round-robin algorithm
 * Runs in a continuous loop to process tasks as workers become available
 */
class Scheduler {
  /**
   * Create Scheduler instance
   * @param {Object} queue - TaskQueue instance
   * @param {Array} workers - Array of Worker instances
   */
  constructor(queue, workers) {
    this.strategy = new RoundRobinStrategy();
    this.queue = queue;
    this.workers = workers;
    this.intervalId = null;
  }

  /**
   * Find next available worker for a task
   * Skips workers that are busy or recently processed this task
   * @private
   * @param {Object} task - Task to assign
   * @returns {Object | null} Available worker or null
   */
  getNextAvailableWorker(task) {
    const attempts = this.workers.length;

    for (let i = 0; i < attempts; i++) {
      const worker = this.strategy.assign(this.workers);

      if (!worker.isBusy && worker.id !== task.lastWorkerId) {
        return worker;
      }
    }

    return null;
  }

  /**
   * Start the scheduler
   * Begins periodic task assignment loop (runs every 100ms)
   * Safe to call multiple times (idempotent)
   */
  schedule() {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => this.run(), 100);
  }

  /**
   * Run one iteration of task scheduling
   * Dequeues a task and assigns it to an available worker
   * Re-enqueues if no worker is available
   * @private
   */
  run() {
    const tasks = this.queue.dequeueBatch(1);
    if (tasks.length === 0) {
      return;
    }

    const task = tasks[0];
    const worker = this.getNextAvailableWorker(task);

    if (!worker) {
      // No available worker, put task back in queue
      this.queue.enqueue(task);
      return;
    }

    // Assign task to worker
    task.status = TaskStatus.ASSIGNED;

    console.log("Assigned:", task.id, "to", worker.id);

    // Emit event for worker to process
    eventBus.emit("taskAssigned", {
      task,
      workerId: worker.id,
    });
  }
}

module.exports = { Scheduler };
