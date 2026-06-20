const JWT = require("jsonwebtoken");
const { UserRepository } = require("../../infrastructure/repositories/UserRepository");

const userRepo = new UserRepository();

const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = JWT.verify(token, process.env.JWT_SECRET);

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
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 1) {
    return res.status(403).json({ message: "Admin access required" });
  }

  return next();
};

module.exports = { requireSignIn, isAdmin };
