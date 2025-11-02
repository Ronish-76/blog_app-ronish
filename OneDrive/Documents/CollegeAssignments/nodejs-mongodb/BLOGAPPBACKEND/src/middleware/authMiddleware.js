const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const User = require("../models/userModels");

// Middleware to verify JWT token and attach user to request
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    if (!config.JWT_SECRET) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "superAdmin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Middleware to check if user owns resource or is admin
const requireOwnershipOrAdmin = (resourceUserIdField = "author") => {
  return (req, res, next) => {
    const resourceUserId = req.resource?.[resourceUserIdField] || req.params.userId;
    
    if (req.user.role === "admin" || req.user.role === "superAdmin") {
      return next();
    }
    
    if (req.user._id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnershipOrAdmin,
};