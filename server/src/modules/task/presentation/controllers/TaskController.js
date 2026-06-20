const { TaskService } = require("../../application/services/TaskService");
const { TaskRepository } = require("../../infrastructure/repositories/TaskRepository");

const taskRepo = new TaskRepository();
const taskService = new TaskService();

/**
 * Check if value is a valid terminal status
 * @param {unknown} value
 * @returns {boolean}
 */
const isTaskRecordStatus = (value) => {
  return value === "completed" || value === "failed";
};

/**
 * Convert task record to API response format
 * @param {Object} taskRecord - Task document from database
 * @returns {Object} Task response object
 */
const toTaskResponse = (taskRecord) => {
  const plainTask =
    typeof taskRecord?.toObject === "function"
      ? taskRecord.toObject()
      : taskRecord;

  return {
    ...plainTask,
    currentStatus: plainTask.internalStatus ?? plainTask.status ?? "QUEUED",
  };
};

/**
 * Create new tasks via bulk upload
 * @async
 * @param {Object} req - Express request
 * @param {Array} req.body.tasks - Array of task objects
 * @param {Object} res - Express response
 * @returns {void}
 */
const createTaskController = async (req, res) => {
  try {
    const { tasks } = req.body;

    await taskService.createTasks(tasks);

    return res.status(202).json({
      status: true,
      success: true,
      message: "Tasks are being processed",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error in task creation",
    });
  }
};

/**
 * Update task status (mark as completed/failed)
 * @async
 * @param {Object} req - Express request with user authentication
 * @param {string} req.params.id - Task ID
 * @param {"completed" | "failed"} req.body.status - New status
 * @param {Object} res - Express response
 * @returns {void}
 */
const updateTaskStatusController = async (req, res) => {
  try {
    const { status } = req.body;

    if (!isTaskRecordStatus(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const taskId = req.params.id;

    if (typeof taskId !== "string") {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await taskRepo.getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await taskRepo.updateTaskStatus(taskId, status);

    return res.status(200).json({
      status: true,
      success: true,
      message: "Task updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating task" });
  }
};

/**
 * Retrieve all tasks
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {void}
 */
const getAllTasksController = async (req, res) => {
  try {
    const tasks = await taskRepo.getAllTasks();

    return res.status(200).send({
      status: true,
      success: true,
      message: "Tasks fetched successfully",
      task: tasks.map(toTaskResponse),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Can't fetch tasks",
      error,
    });
  }
};

/**
 * Get dashboard statistics
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {void}
 */
const getDashboardStatsController = async (req, res) => {
  try {
    const totalTasks = await taskRepo.countTasks();

    return res.status(200).json({
      status: true,
      success: true,
      data: {
        totalTasks,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
    });
  }
};

module.exports = {
  createTaskController,
  updateTaskStatusController,
  getAllTasksController,
  getDashboardStatsController,
};
