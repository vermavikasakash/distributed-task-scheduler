const { randomUUID } = require("crypto");
const { Task } = require("../../domain/entities/Task");
const { publishTask } = require("../../../../shared/config/rabbitmq");

/**
 * TaskService - Application service layer for task operations
 * Publishes tasks to RabbitMQ. Workers own task persistence.
 */
class TaskService {
  /**
   * Create and queue multiple tasks
   * Tasks are assigned unique IDs and queued for worker processing.
   */
  async createTasks(tasks) {
    const taskObjects = tasks.map((taskPayload) => {
      return new Task(randomUUID(), taskPayload);
    });

    console.log("Tasks published:", taskObjects.length);

    await Promise.all(taskObjects.map((task) => publishTask(task)));
  }
}

module.exports = { TaskService };
