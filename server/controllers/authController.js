const { hashPassword, comparePassword } = require("../helpers/authHelper");
const { User, Task, AssignmentState } = require("../models/userModel");
const { addTasks } = require("../helpers/queueService");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    //! validations
    if (!name) {
      return res.send({ error: "Name is required" });
    }
    if (!email) {
      return res.send({ error: "email is required" });
    }
    if (!phone) {
      return res.send({ error: "phone is required" });
    }
    if (!password) {
      return res.send({ error: "password is required" });
    }

    //   ! check user if already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }

    //   !  if new user then register and save
    const hashPass = await hashPassword(password);
    //   ? save
    const user = await new User({
      name,
      email,
      password: hashPass,
      phone,
    }).save();
    res
      .status(200)
      .send({ success: true, message: "User Registered Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

// ! LOGIN (Post) CONTROLLER
const loginController = async (req, res) => {
  try {
    const { password, email } = req.body;
    // ? validation
    if (!email || !password) {
      return res
        .status(404)
        .send({ success: false, message: "Invalid Email or Password" });
    }

    // check user is registered
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: false,
        success: false,
        message: "Email is not registered ",
      });
    }
    // if registered check password
    const matched = await comparePassword(password, user.password);
    if (!matched) {
      return res.status(200).send({
        status: false,
        message: "Invalid Password",
      });
    }
    // Password matches
    const token = await JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.status(200).send({
      status: true,
      message: "Successfully Login",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

//? createAgentFn
// ! CREATE Task
const createTaskController = async (req, res) => {
  try {
    const { tasks } = req.body;

    const validTasks = tasks.filter(
      (task) => task.firstName && task.phone && task.notes,
    );

    if (!validTasks.length) {
      return res.status(400).json({
        success: false,
        message: "No valid tasks found",
      });
    }
    if (validTasks.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Maximum 1000 tasks allowed per request",
      });
    }

    // Push to queue instead of processing
    addTasks(validTasks);

    return res.status(202).json({
      success: true,
      message: "Tasks are being processed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in task creation",
    });
  }
};

// ? PATCH TASK STATUS CONTROLLER
const updateTaskStatusController = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.agentId.toString() !== req.user._id && req.user.role !== 1) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task",
    });
  }
};

//? TEST TOKEN
const testController = (req, res) => {
  res.send("Token working");
};

//? GET AGENTS

const getAgentsController = async (req, res) => {
  try {
    let agent = await User.find({ role: 0 });

    if (!agent || agent.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No agents available for task assignment",
      });
    }

    res
      .status(200)
      .send({ success: true, message: "Agent fetched successfully", agent });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Can't find agent",
      error,
    });
  }
};

//? GET ALL TASKS

const getAllTasksController = async (req, res) => {
  try {
    let task = await Task.find({});
    res
      .status(200)
      .send({ success: true, message: "Tasks fetched successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Can't find agent",
      error,
    });
  }
};

//? GET AGENT TASKS
const getMyTasksController = async (req, res) => {
  try {
    const task = await Task.find({ agentId: req.user._id });

    res.status(200).send({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching tasks",
    });
  }
};

//? GET DASHBOARD STATS
const getDashboardStatsController = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const totalAgents = await User.countDocuments({ role: 0 }); // adjust if needed

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        totalAgents,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
    });
  }
};

// ! EXPORTS
module.exports = {
  registerController,
  loginController,
  createTaskController,
  updateTaskStatusController,
  testController,
  getAgentsController,
  getAllTasksController,
  getDashboardStatsController,
  getMyTasksController,
};
