"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const UserModel_1 = require("../models/UserModel");
class UserRepository {
    async getUserById(userId) {
        return UserModel_1.UserModel.findById(userId);
    }
    async getUserByEmail(email) {
        return UserModel_1.UserModel.findOne({ email });
    }
    async createUser(data) {
        return UserModel_1.UserModel.create(data);
    }
}
exports.UserRepository = UserRepository;
