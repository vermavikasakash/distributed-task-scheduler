const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./shared/config/db");
const {
  TASK_QUEUE,
  connectRabbitMQ,
  publishTask,
  closeRabbitMQ,
} = require("./shared/config/rabbitmq");
const { TaskStatus } = require("./shared/enums/enums");
const {
  TaskRepository,
} = require("./modules/task/infrastructure/repositories/TaskRepository");

const MAX_RETRIES = Number(process.env.TASK_MAX_RETRIES || 3);
const PROCESSING_TIME_MS = Number(process.env.TASK_PROCESSING_TIME_MS || 1000);
const FAILURE_RATE = Number(process.env.TASK_FAILURE_RATE || 0.3);
const taskRepository = new TaskRepository();

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const processTask = async (task) => {
  await sleep(PROCESSING_TIME_MS);

  if (Math.random() < FAILURE_RATE) {
    throw new Error("Simulated task failure");
  }

  console.log(`Processed task ${task.id}: ${task.payload.notes}`);
};

const startWorker = async () => {
  await connectDB();

  const channel = await connectRabbitMQ();

  channel.prefetch(1);

  await channel.consume(TASK_QUEUE, (message) => handleTask(channel, message), {
    noAck: false,
  });

  console.log("Worker is waiting for tasks...");
};

// helper function for clarity
const handleTask = async (channel, message) => {
  if (!message) return;

  let task;
  const retryCount = Number(message.properties.headers?.retryCount || 0);

  try {
    task = JSON.parse(message.content.toString());

    await taskRepository.createTaskRecord(task);

    await processTask(task);

    await taskRepository.updateTaskStatus(
      task.id,
      TaskStatus.COMPLETED,
      retryCount,
    );

    channel.ack(message);
  } catch (error) {
    console.error(`Task ${task?.id || "unknown"} failed: ${error.message}`);

    if (!task) {
      channel.nack(message, false, false);
      return;
    }

    const nextRetryCount = retryCount + 1;

    if (nextRetryCount >= MAX_RETRIES) {
      await taskRepository.updateTaskStatus(
        task.id,
        TaskStatus.FAILED,
        nextRetryCount,
      );
    } else {
      await taskRepository.updateTaskStatus(
        task.id,
        TaskStatus.RETRY,
        nextRetryCount,
      );

      await publishTask(task, {
        retry: true,
        retryCount: nextRetryCount,
      });
    }

    channel.ack(message);
  }
};

const shutdown = async () => {
  await closeRabbitMQ();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startWorker().catch((error) => {
  console.error("Worker failed to start:", error);
  process.exit(1);
});
