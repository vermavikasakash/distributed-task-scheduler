const { TaskStatus } = require("../../../../shared/enums/enums");
const { TaskModel } = require("../models/TaskModel");

/**
 * TaskRepository - Data access layer for Task operations
 * Implements the Repository pattern for database interactions
 */
class TaskRepository {

  getTerminalStatus(task) {
    if (task.status === TaskStatus.COMPLETED) {
      return "completed";
    }

    if (task.status === TaskStatus.FAILED) {
      return "failed";
    }

    return null;
  }

  async createTaskRecord(task) {
    const terminalStatus = this.getTerminalStatus(task);

    await TaskModel.findOneAndUpdate(
      { taskId: task.id },
      {
        $set: {
          firstName: task.payload.firstName,
          phone: task.payload.phone,
          notes: task.payload.notes,
          taskId: task.id,
          retryCount: task.retryCount,
          internalStatus: task.status,
          ...(terminalStatus ? { status: terminalStatus } : {}),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      }
    );
  }

  // Update task status
  async updateTaskStatus(taskId, status) {
    const internalStatus =
      status === "completed" ? TaskStatus.COMPLETED : TaskStatus.FAILED;

    return TaskModel.findByIdAndUpdate(
      taskId,
      { status, internalStatus },
      { returnDocument: "after" }
    );
  }

  // Retrieve all tasks i.e Array of tasks
  async getAllTasks() {
    return TaskModel.find({});
  }

  async countTasks() {
    return TaskModel.countDocuments();
  }

  async getTaskById(taskId) {
    return TaskModel.findById(taskId);
  }
}

module.exports = { TaskRepository };
