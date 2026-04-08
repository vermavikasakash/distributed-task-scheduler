"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testController = exports.loginController = exports.registerController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const authHelper_1 = require("../helper/authHelper");
const userRepo = new UserRepository_1.UserRepository();
const registerController = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).send({ error: "All fields required" });
        }
        const existingUser = await userRepo.getUserByEmail(email);
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already registered",
            });
        }
        const hashPass = await (0, authHelper_1.hashPassword)(password);
        const user = await userRepo.createUser({
            name,
            email,
            password: hashPass,
            phone,
        });
        const _a = user.toObject(), { password: _ } = _a, safeUser = __rest(_a, ["password"]);
        return res.status(200).send({
            status: true,
            success: true,
            user: safeUser,
            message: "User registered successfully",
        });
    }
    catch (error) {
        return res.status(500).send({ success: false, error });
    }
};
exports.registerController = registerController;
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const match = await (0, authHelper_1.comparePassword)(password, user.password);
        if (!match) {
            return res.status(400).send({ message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const _a = user.toObject(), { password: _ } = _a, safeUser = __rest(_a, ["password"]);
        return res.send({
            status: true,
            success: true,
            message: "Login successful",
            user: safeUser,
            token,
        });
    }
    catch (error) {
        return res.status(500).send({ success: false, error });
    }
};
exports.loginController = loginController;
const testController = (req, res) => {
    res.send("Token working");
};
exports.testController = testController;
