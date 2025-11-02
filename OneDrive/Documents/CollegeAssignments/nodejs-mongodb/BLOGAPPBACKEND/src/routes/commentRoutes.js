const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../middleware/authMiddleware");

// POST /api/comments/:postId
router.post("/:postId", authenticateToken, commentController.createComment);

// PUT /api/comments/:id
router.put("/:id", authenticateToken, commentController.updateComment);

// DELETE /api/comments/:id
router.delete("/:id", authenticateToken, commentController.deleteComment);

module.exports = router;