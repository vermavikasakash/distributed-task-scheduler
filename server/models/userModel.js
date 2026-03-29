const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    phone: { type: String, required: true },
    notes: { type: String, required: true, trim: true },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },

    agentName: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const assignmentStateSchema = new mongoose.Schema({
  lastAssignedAgentIndex: {
    type: Number,
    default: -1
  }
});

const User = mongoose.model("users", userSchema);
const Task = mongoose.model("tasks", taskSchema);
const AssignmentState = mongoose.model("AssignmentState", assignmentStateSchema);

module.exports = { User, Task, AssignmentState };

//timestamps is used to get details when user is created
