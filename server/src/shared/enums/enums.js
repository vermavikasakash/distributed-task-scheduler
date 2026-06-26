/**
 * @enum {string} TaskStatus
 * Enum for task status states
 */
const TaskStatus = {
  QUEUED: "QUEUED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  RETRY: "RETRY",
};

module.exports = { TaskStatus };
