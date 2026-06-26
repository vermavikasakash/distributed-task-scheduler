const mongoose = require("mongoose");
const { TaskStatus } = require("../../../../shared/enums/enums");

const taskSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    phone: { type: String, required: true },
    notes: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PROCESSING,
      required: true,
    },

    taskId: { type: String, required : true },
    retryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("tasks", taskSchema);

module.exports = { TaskModel };
