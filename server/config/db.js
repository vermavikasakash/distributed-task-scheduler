const mongoose = require("mongoose");
require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to Database ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.log(`MONGO_DB ERROR ${error}`.bgRed);
  }
};
module.exports = connectDB;
