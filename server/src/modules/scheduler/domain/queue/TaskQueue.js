class TaskQueue {
  constructor() {
    this.queue = [];
  }

  // Add a single task to the queue
  enqueue(task) {
    this.queue.push(task);
  }

  // Add multiple tasks to the queue at once
  enqueueBulk(tasks) {
    this.queue.push(...tasks);
  }

  /**
   * Remove and return a batch of tasks ready for processing
   * Respects retry scheduling (nextRetryAt) and respects batch size
   * @param {number} size - Maximum number of tasks to dequeue
   * @returns {Array} Array of tasks ready for processing (max size)
   */
  dequeueBatch(size) {
    const now = Date.now();

    const selected = [];
    const remaining = [];

    for (const task of this.queue) {
      if (
        selected.length < size &&
        (!task.nextRetryAt || task.nextRetryAt <= now)
      ) {
        selected.push(task);
      } else {
        remaining.push(task);
      }
    }

    this.queue = remaining;

    return selected;
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  // Get number of pending tasks
  getPendingCount() {
    return this.queue.length;
  }
}

module.exports = { TaskQueue };
