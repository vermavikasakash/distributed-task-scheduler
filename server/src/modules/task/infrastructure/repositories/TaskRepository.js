const { TaskStatus } = require("../../../../shared/enums/enums");
const { TaskModel } = require("../models/TaskModel");

/**
 * TaskRepository - Data access layer for Task operations
 * Implements the Repository pattern for database interactions
 */
class TaskRepository {
  async createTaskRecord(task) {
    await TaskModel.findOneAndUpdate(
      { taskId: task.id },
      {
        $setOnInsert: {
          firstName: task.payload.firstName,
          phone: task.payload.phone,
          notes: task.payload.notes,
          taskId: task.id,
          retryCount: 0,
          status: TaskStatus.PROCESSING,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  async updateTaskStatus(taskId, status, retryCount = 0) {
    return TaskModel.findOneAndUpdate( { taskId },
      {  $set: {
          status,
          retryCount,
        },
      },
      {
        returnDocument: "after",
      },
    );
  }

  // Retrieve all tasks i.e Array of tasks
  async getAllTasks() {
    return TaskModel.find({});
  }

  async countTasks() {
    return TaskModel.countDocuments();
  }
}

module.exports = { TaskRepository };
