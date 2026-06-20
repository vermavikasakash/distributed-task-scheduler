const express = require("express");
const {
  loginController,
  registerController,
  testController,
} = require("../controllers/authController");
const { isAdmin, requireSignIn } = require("../middleware/authMiddleware");
const {
  createTaskController,
  getAllTasksController,
  getDashboardStatsController,
  updateTaskStatusController,
} = require("../../../task/presentation/controllers/TaskController");

const router = express.Router();

/**
 * Auth Routes - Handles user registration, login, and authentication
 */

// POST /register - Register a new user
router.post("/register", registerController);

// POST /login - Login user
router.post("/login", loginController);

// GET /user-auth - Check if user is authenticated
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

/**
 * Task Routes - Requires authentication and admin role
 */

// POST /createTask - Create new tasks (Admin only)
router.post("/createTask", requireSignIn, isAdmin, createTaskController);

// PATCH /task/:id/status - Update task status (Admin only)
router.patch("/task/:id/status", requireSignIn, isAdmin, updateTaskStatusController);

// GET /get - Test endpoint
router.get("/get", requireSignIn, isAdmin, testController);

// GET /getTasks - Get all tasks (Admin only)
router.get("/getTasks", requireSignIn, isAdmin, getAllTasksController);

// GET /dashboard-stats - Get dashboard statistics (Admin only)
router.get("/dashboard-stats", requireSignIn, isAdmin, getDashboardStatsController);

module.exports = { router };
