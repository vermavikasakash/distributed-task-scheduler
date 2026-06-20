const mongoose = require("mongoose");
const { TaskStatus } = require("../../../../shared/enums/enums");

const taskSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    phone: { type: String, required: true },
    notes: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: ["completed", "failed"],
      required: false,
    },

    taskId: { type: String },
    retryCount: { type: Number, default: 0 },
    internalStatus: {
      type: String,
      enum: Object.values(TaskStatus),
      required: true,
      default: TaskStatus.QUEUED,
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("tasks", taskSchema);

module.exports = { TaskModel };
