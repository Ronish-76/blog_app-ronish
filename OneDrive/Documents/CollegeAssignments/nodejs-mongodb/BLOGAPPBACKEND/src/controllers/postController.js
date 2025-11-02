const Post = require("../models/postModel");
const Like = require("../models/likeModel");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const post = new Post({
      title,
      content,
      author: req.user._id,
    });

    await post.save();
    await post.populate("author", "name email");

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("author", "name email");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    ).populate("author", "name email");

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    // Check if user already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: "Post already liked" });
    }
    
    // Add user to likes array
    post.likes.push(userId);
    await post.save();
    
    // Create like record
    await Like.create({ user: userId, post: id });
    
    const updatedPost = await Post.findById(id).populate("author", "name email");
    res.status(200).json({ message: "Post liked successfully", post: updatedPost });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    // Check if user has liked the post
    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: "Post not liked yet" });
    }
    
    // Remove user from likes array
    post.likes.pull(userId);
    await post.save();
    
    // Remove like record
    await Like.deleteOne({ user: userId, post: id });
    
    const updatedPost = await Post.findById(id).populate("author", "name email");
    res.status(200).json({ message: "Post unliked successfully", post: updatedPost });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
};