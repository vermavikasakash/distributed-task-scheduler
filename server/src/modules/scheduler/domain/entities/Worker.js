const { TaskStatus } = require("../../../../shared/enums/enums");

const WorkerProcessResult = {
  REQUEUED: "REQUEUED",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

/**
 * Worker - Represents an agent/worker that processes tasks
 * Implements rate limiting and task processing logic
 */
class Worker {
  isBusy = false;
  processedCount = 0;
  windowStart = Date.now();

  RATE_LIMIT = 2;
  WINDOW_SIZE = 1000; // 1 second window

  // Create a Worker instance 
  constructor(id, taskStore) {
    this.id = id; // Unique worker identifier
    this.taskStore = taskStore; // Database access for persistence
  }

  // Check if worker can process more tasks within rate limit
  canProcess() {
    const now = Date.now();

    if (now - this.windowStart >= this.WINDOW_SIZE) {
      this.windowStart = now;
      this.processedCount = 0;
    }

    return this.processedCount < this.RATE_LIMIT;
  }

  // Persist task state to database
  async persistTaskState(task) {
    try {
      await this.taskStore.createTaskRecord(task);
    } catch (error) {
      console.error("Error saving task record:", error);
    }
  }

  /**
   * Process a task
   * Handles rate limiting, simulated processing, and retry logic
   * @async
   * @param {Object} task - Task to process
   * @returns {Promise<string>} WorkerProcessResult
   */
  async process(task) {
    task.lastWorkerId = this.id;

    // Check rate limiting
    if (!this.canProcess()) {
      console.log(`Worker ${this.id} rate limited`);
      task.retry();
      await this.persistTaskState(task);
      return task.status === TaskStatus.FAILED
        ? WorkerProcessResult.FAILED
        : WorkerProcessResult.REQUEUED;
    }

    this.processedCount++;
    this.isBusy = true;

    task.status = TaskStatus.PROCESSING;
    await this.persistTaskState(task);

    try {
      // Simulate random failures (70% failure rate for demo)
      if (Math.random() < 0.7) {
        throw new Error("Random failure");
      }

      // Simulate task processing time
      await new Promise((resolve) => setTimeout(resolve, 1000));
      task.status = TaskStatus.COMPLETED;
      await this.persistTaskState(task);
      return WorkerProcessResult.COMPLETED;
    } catch (err) {
      console.log("Failed to process task", task.id);
      task.retry();
      await this.persistTaskState(task);
      return task.status === TaskStatus.FAILED
        ? WorkerProcessResult.FAILED
        : WorkerProcessResult.REQUEUED;
    } finally {
      this.isBusy = false;
    }
  }
}

module.exports = { Worker, WorkerProcessResult };
