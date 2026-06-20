const JWT = require("jsonwebtoken");
const { UserRepository } = require("../../infrastructure/repositories/UserRepository");
const { comparePassword, hashPassword } = require("../helper/authHelper");

const userRepo = new UserRepository();

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

    const hashPass = await hashPassword(password);

    const user = await userRepo.createUser({
      name,
      email,
      password: hashPass,
      phone,
    });

    const userObject =
      typeof user.toObject === "function" ? user.toObject() : user;
    const { password: _, ...safeUser } = userObject;

    return res.status(200).send({
      status: true,
      success: true,
      user: safeUser,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, error });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.getUserByEmail(email);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({ message: "Invalid password" });
    }

    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userObject =
      typeof user.toObject === "function" ? user.toObject() : user;
    const { password: _, ...safeUser } = userObject;

    return res.send({
      status: true,
      success: true,
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, error });
  }
};

const testController = (req, res) => {
  res.send("Token working");
};

module.exports = { registerController, loginController, testController };
