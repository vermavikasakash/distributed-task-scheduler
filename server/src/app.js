const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const morgan = require("morgan");

const { router: taskRoute } = require("./modules/task/presentation/routes/taskRoutes");
const { connectDB } = require("./shared/config/db");
const { connectRabbitMQ, closeRabbitMQ } = require("./shared/config/rabbitmq");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/tasks", taskRoute);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running");
});

const startServer = async () => {
  await connectDB();
  await connectRabbitMQ();

  const PORT = process.env.PORT || 5000;
  const dev = process.env.DEV_MODE || "development";

  app.listen(PORT, () => {
    console.log(`Server running in ${dev} mode on port ${PORT}`);
  });
};

const shutdown = async () => {
  await closeRabbitMQ();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Server failed to start:", error);
    process.exit(1);
  });
}

module.exports = { app, startServer };
