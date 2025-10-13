const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
/**
 * @description routes for register
 * @method POST
 * @route POST /api/auth/v1/register
 * @access Public
 * @body { username, email, password }
 * @returns { message, user }on success
 * @returns { error } on failure
 *
 */
router.post("/register", authController.register);

// http method
// GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD

module.exports = router;
