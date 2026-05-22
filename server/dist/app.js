"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = require("./modules/auth/presentation/routes/authRoutes");
const db_1 = require("./shared/config/db");
const cors = require("cors");
const colors = require("colors");
const morgan = require("morgan");
const app = (0, express_1.default)();
// configure env
dotenv_1.default.config();
// db connect
(0, db_1.connectDB)();
// middleware
app.use(cors());
app.use(express_1.default.json());
app.use(morgan("dev"));
//routes
app.use("/api/v1/auth", authRoutes_1.router);
// health check 
app.get("/", (req, res) => {
    res.send("Server is running");
});
const PORT = process.env.PORT || 8080;
const dev = process.env.DEV_MODE;
app.listen(PORT, (err) => {
    if (err)
        console.log(err);
    console.log(colors.bgRed(`server run on ${dev} port ${PORT}`));
});
