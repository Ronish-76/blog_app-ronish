const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken } = require("../middleware/authMiddleware");

// POST /api/posts (create post)
router.post("/", authenticateToken, postController.createPost);

// GET /api/posts (get all posts)
router.get("/", postController.getAllPosts);

// GET /api/posts/:id (get single post)
router.get("/:id", postController.getPostById);

// PUT /api/posts/:id (update)
router.put("/:id", authenticateToken, postController.updatePost);

// DELETE /api/posts/:id
router.delete("/:id", authenticateToken, postController.deletePost);

// POST /api/posts/:id/like
router.post("/:id/like", authenticateToken, postController.likePost);

// DELETE /api/posts/:id/unlike
router.delete("/:id/unlike", authenticateToken, postController.unlikePost);

module.exports = router;