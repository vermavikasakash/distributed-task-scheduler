const { TaskStatus } = require("../../../../shared/enums/enums");

class Task {
  status = TaskStatus.QUEUED;
  retryCount = 0;
  maxRetries = 3;
  lastWorkerId = undefined;
  nextRetryAt = 0;

  // Task instance
  constructor(id, payload) {
    this.id = id; //id - Unique task identifier
    this.payload = payload;
  }

  retry() {
    this.retryCount++;

    if (this.retryCount >= this.maxRetries) {
      this.status = TaskStatus.FAILED;
    } else {
      this.status = TaskStatus.RETRY;
      const delay = 1000 * Math.pow(2, this.retryCount);
      this.nextRetryAt = Date.now() + delay;
    }
  }
}

module.exports = { Task };
