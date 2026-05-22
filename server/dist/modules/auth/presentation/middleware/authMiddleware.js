"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.requireSignIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const userRepo = new UserRepository_1.UserRepository();
const requireSignIn = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
            return res.status(401).json({
                message: "Invalid authorization format",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded._id || decoded.role === undefined) {
            return res.status(401).json({
                message: "Invalid token payload",
            });
        }
        const user = await userRepo.getUserById(decoded._id);
        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};
exports.requireSignIn = requireSignIn;
const isAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 1) {
        return res.status(403).json({ message: "Admin access required" });
    }
    return next();
};
exports.isAdmin = isAdmin;
