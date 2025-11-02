const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken, requireAdmin } = require("../middleware/authMiddleware");

// POST /api/users/register
router.post("/register", authController.register);

// POST /api/users/login
router.post("/login", authController.login);

// GET /api/users/:id (user profile)
router.get("/:id", authController.getUserById);

// DELETE /api/users/:id
router.delete("/:id", authenticateToken, requireAdmin, authController.deleteUser);

module.exports = router;