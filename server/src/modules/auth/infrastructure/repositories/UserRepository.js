const { UserModel } = require("../models/UserModel");

/**
 * UserRepository - Data access layer for User operations
 * Implements the Repository pattern for database interactions
 */
class UserRepository {
  /**
   * Retrieve user by ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async getUserById(userId) {
    return UserModel.findById(userId);
  }

  /**
   * Retrieve user by email
   * @param {string} email - The user's email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async getUserByEmail(email) {
    return UserModel.findOne({ email });
  }

  /**
   * Create a new user
   * @param {Object} data - User data
   * @param {string} data.name - User's full name
   * @param {string} data.email - User's email
   * @param {string} data.password - User's hashed password
   * @param {string} data.phone - User's phone number
   * @param {number} [data.role=0] - User's role
   * @returns {Promise<Object>} Created user object
   */
  async createUser(data) {
    return UserModel.create(data);
  }
}

module.exports = { UserRepository };
