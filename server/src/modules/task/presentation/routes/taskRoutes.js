const express = require("express");
const {
  createTaskController,
  getAllTasksController,
  getDashboardStatsController,
} = require("../controllers/TaskController");

const router = express.Router();

router.post("/", createTaskController);
router.get("/", getAllTasksController);
router.get("/dashboard-stats", getDashboardStatsController);

module.exports = { router };
