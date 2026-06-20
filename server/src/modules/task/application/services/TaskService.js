const { v4: uuidv4 } = require("uuid");
const { Task } = require("../../domain/entities/Task");
const { TaskRepository } = require("../../infrastructure/repositories/TaskRepository");
const { taskQueue, scheduler } = require("../../../scheduler/bootstrap/schedulerInstance");

/**
 * TaskService - Application service layer for task operations
 * Orchestrates task creation, queuing, and scheduling
 */
class TaskService {
  /**
   * Create TaskService instance
   * @param {TaskRepository} [taskRepo=new TaskRepository()] - Task repository instance
   */
  constructor(taskRepo = new TaskRepository()) {
    this.taskRepo = taskRepo;
  }

  /**
   * Create and queue multiple tasks
   * Tasks are assigned unique IDs, persisted to database, and queued for processing
   * @async
   * @param {Array<Object>} tasks - Array of task payloads
   * @param {string} tasks[].firstName - First name
   * @param {string} tasks[].phone - Phone number
   * @param {string} tasks[].notes - Task notes
   * @returns {Promise<void>}
   */
  async createTasks(tasks) {
    const taskObjects = tasks.map((taskPayload) => {
      return new Task(uuidv4(), taskPayload);
      // Task is already initialized with status = QUEUED in constructor
    });

    console.log("Tasks added:", taskObjects.length);

    // Persist all tasks to database
    await Promise.all(
      taskObjects.map((task) => this.taskRepo.createTaskRecord(task))
    );

    // Enqueue tasks for processing
    taskQueue.enqueueBulk(taskObjects);

    // Start the scheduler
    scheduler.schedule();
  }
}

module.exports = { TaskService };
