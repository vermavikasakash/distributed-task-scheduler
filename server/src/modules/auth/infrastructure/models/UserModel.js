const mongoose = require("mongoose");

/**
 * @typedef {Object} IUser
 * @property {string} name - User's full name
 * @property {string} [email] - User's email address (unique)
 * @property {string} password - User's password (hashed)
 * @property {string} phone - User's phone number
 * @property {number} role - User's role (0: User, 1: Admin)
 */

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

const UserModel = mongoose.model("users", userSchema);

module.exports = { UserModel };
