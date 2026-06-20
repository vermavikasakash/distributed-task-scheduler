const { TaskStatus } = require("../../../../shared/enums/enums");
const { WorkerProcessResult } = require("../entities/Worker");
const { eventBus } = require("../events/EventBus");

/**
 * WorkerRunner - Orchestrates worker task processing
 * Listens for task assignment events and executes them
 * Handles retries and failure cases
 */
class WorkerRunner {
  /**
   * Create WorkerRunner instance
   * Automatically starts listening for task assignments
   * @param {Object} worker - Worker instance
   * @param {Object} taskQueue - TaskQueue instance
   */
  constructor(worker, taskQueue) {
    this.worker = worker;
    this.taskQueue = taskQueue;
    this.listen();
  }

  /**
   * Listen for taskAssigned events from the scheduler
   * Processes tasks and handles results
   * @private
   */
  listen() {
    eventBus.on("taskAssigned", async ({ task, workerId }) => {
      // Only process if this is the assigned worker
      if (workerId !== this.worker.id) {
        return;
      }

      // Don't process if worker is busy
      if (this.worker.isBusy) {
        return;
      }

      console.log(`Worker ${this.worker.id} processing:`, task.id);

      try {
        const result = await this.worker.process(task);

        // Unified result handling
        if (result === WorkerProcessResult.REQUEUED) {
          console.log("Re-enqueue (retry or rate limit):", task.id);
          this.taskQueue.enqueue(task);
        } else if (result === WorkerProcessResult.FAILED) {
          console.log("Failed permanently:", task.id);
        } else if (result === WorkerProcessResult.COMPLETED) {
          console.log("Completed:", task.id);
        }
      } catch (error) {
        console.error(
          `Worker ${this.worker.id} crashed while processing ${task.id}:`,
          error
        );

        task.retry();

        // Re-enqueue if retry is scheduled, otherwise mark as failed
        if (task.status === TaskStatus.RETRY) {
          console.log("Re-enqueue (unexpected crash):", task.id);
          this.taskQueue.enqueue(task);
        } else {
          console.log("Failed permanently after crash:", task.id);
        }
      } finally {
        // Signal task completion to trigger scheduler
        eventBus.emit("taskCompleted");
      }
    });
  }
}

module.exports = { WorkerRunner };
