const { TaskService } = require("../../application/services/TaskService");
const { TaskRepository } = require("../../infrastructure/repositories/TaskRepository");

const taskRepo = new TaskRepository();
const taskService = new TaskService();

/**
 * Create new tasks via bulk upload
 * @param {Array} req.body.tasks - Array of task objects
 */
const createTaskController = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one task",
      });
    }

    const hasInvalidTask = tasks.some(
      (task) =>
        !task ||
        !String(task.firstName || "").trim() ||
        !String(task.phone || "").trim() ||
        !String(task.notes || "").trim()
    );

    if (hasInvalidTask) {
      return res.status(400).json({
        success: false,
        message: "Every task needs firstName, phone, and notes",
      });
    }

    await taskService.createTasks(tasks);

    return res.status(202).json({
      status: true,
      success: true,
      message: "Tasks published to RabbitMQ",
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
 * Retrieve all tasks
 */
const getAllTasksController = async (req, res) => {
  try {
    const tasks = await taskRepo.getAllTasks();

    return res.status(200).send({
      status: true,
      success: true,
      message: "Tasks fetched successfully",
      task : tasks,
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
  getAllTasksController,
  getDashboardStatsController,
};
