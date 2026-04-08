"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose = require("mongoose");
const colors = require("colors");
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(colors.bgMagenta.white(`Connected to Database ${conn.connection.host}`));
    }
    catch (error) {
        console.log(colors.bgRed(`MONGO_DB ERROR ${error}`));
        process.exit(1);
    }
};
exports.connectDB = connectDB;
