const Post = require("../models/post");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a Post
const createPost = async (req, res) => {
  const { user_id, title, description, post_type, category, tags } = req.body;

  try {
    const media_urls = req.files
      ? await Promise.all(
          req.files.map((file) => {
            const isVideo = file.mimetype.startsWith("video");
            return cloudinary.uploader.upload(file.path, {
              folder: "posts/media",
              resource_type: isVideo ? "video" : "image", // Specify resource type
            });
          })
        ).then((uploads) => uploads.map((upload) => upload.secure_url))
      : [];

    // Determine media type
    const media_type =
      media_urls.length > 0 && req.files[0].mimetype.startsWith("video")
        ? "Video"
        : media_urls.length > 0
        ? "Image"
        : "None";

    // Create the new post
    const newPost = new Post({
      user_id,
      title,
      description,
      post_type,
      media_type,
      media_urls,
      category,
      tags,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create post.",
      error: error.message,
    });
  }
};


// Update a Post
const updatePost = async (req, res) => {
  const { post_id } = req.params;
  const { user_id, title, description, post_type, category, tags } = req.body;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.user_id.toString() !== user_id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own posts.",
      });
    }

    // Handle new media uploads
    const new_media_urls = req.files
      ? await Promise.all(
          req.files.map((file) =>
            cloudinary.uploader.upload(file.path, { folder: "posts/media" })
          )
        ).then((uploads) => uploads.map((upload) => upload.secure_url))
      : [];

    // Update fields
    post.title = title || post.title;
    post.description = description || post.description;
    post.post_type = post_type || post.post_type;
    post.category = category || post.category;
    post.tags = tags || post.tags;

    if (new_media_urls.length > 0) {
      post.media_urls = new_media_urls;
      post.media_type =
        new_media_urls[0].endsWith(".mp4") || new_media_urls[0].endsWith(".avi")
          ? "Video"
          : "Image";
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update post.",
      error: error.message,
    });
  }
};

// Delete a Post
const deletePost = async (req, res) => {
  const { post_id } = req.params;
  const { user_id } = req.body;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.user_id.toString() !== user_id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts.",
      });
    }

    // Delete the post from the database
    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete post.",
      error: error.message,
    });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 }).populate("user_id", "name profile_pic_url occupation");
    console.log("Populated posts:", posts);
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts.",
      error: error.message,
    });
  }
};

const getUserPosts = async (req, res) => {
  user_id = req.params;
  try {
    const posts = await Post.find(user_id).sort({ _id: -1 }).populate("user_id", "name profile_pic_url occupation");
    console.log("Populated posts:", posts);
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts.",
      error: error.message,
    });
  }
};

const getUserHavePost = async (req, res) => {
  user_id = req.params;
  try {
    const posts = await Post.find(user_id).sort({ _id: -1 }).populate("user_id", "name profile_pic_url occupation");
    console.log("Populated posts:", posts);
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts.",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getUserPosts,
};