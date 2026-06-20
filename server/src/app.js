const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");
const morgan = require("morgan");

const  { router: authRoute  } = require("./modules/auth/presentation/routes/authRoutes");
const { connectDB } = require("./shared/config/db");

const app = express();

// Configure environment variables
dotenv.config();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoute);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 8080;
const dev = process.env.DEV_MODE || "development";

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(colors.bgRed(`server run on ${dev} port ${PORT}`));
});

module.exports = { app };
