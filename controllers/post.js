const Post = require("../models/post");
const { uploadToCloudinary } = require("../utils/cloudinary");
const cloudinary = require('cloudinary').v2;

// Create a Post
const createPost = async (req, res) => {
  try {
    const { user_id, title, description, post_type, category, tags } = req.body;

    // Handle media uploads if present
    const media = req.files
      ? await Promise.all(
          req.files.map((file) => {
            const isVideo = file.mimetype.startsWith("video");
            return uploadToCloudinary(file.buffer, "posts/media", isVideo);
          })
        )
      : [];

    // Map media to include both URL and public_id
    const media_urls = media.map((upload) => ({
      url: upload.secure_url,
      public_id: upload.public_id,
    }));

    // Determine the media type
    const media_type =
      media_urls.length > 0 && req.files[0]?.mimetype?.startsWith("video")
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
      media_urls, // Includes both URL and public_id
      category,
      tags,
    });

    await newPost.save();
    res.status(201).json({ success: true, message: "Post created successfully.", post: newPost });
  } catch (error) {
    console.error("Error in creating post:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create post.",
      error: error.message,
    });
  }
};

// Update a Post
const updatePost = async (req, res) => {
  
  try {
    const { post_id } = req.params;
    const { user_id, title, description, post_type, category, tags } = req.body;
  
  console.log('title is: ',title);
  console.log('description is: ',description);
    // Find the post by ID
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // if (post.user_id.toString() !== user_id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You can only update your own posts.",
    //   });
    // }
    
    // Handle new media uploads if present
    const new_media = req.files
    ? await Promise.all(
      req.files.map((file) => {
        const isVideo = file.mimetype.startsWith("video");
        return uploadToCloudinary(file.buffer, "posts/media", isVideo);
      })
    )
    : [];
    
    console.log('new_media is: ',new_media);


    const new_media_urls = new_media.map((media) => ({
      url: media.secure_url,
      public_id: media.public_id,
    }));

    // Delete old media from Cloudinary if new media is uploaded
    if (new_media_urls.length > 0) {
      await Promise.all(
        post.media_urls.map(async (media) => {
          if (media.public_id) {
            await cloudinary.uploader.destroy(media.public_id, {
              resource_type: media.url.endsWith(".mp4") ? "video" : "image",
            });
          }
        })
      );

      // Update media in the post
      post.media_urls = new_media_urls;
      post.media_type =
        new_media_urls[0]?.url?.endsWith(".mp4") || new_media_urls[0]?.url?.endsWith(".avi")
          ? "Video"
          : "Image";
    }

    // Update other fields
    post.title = title || post.title;
    post.description = description || post.description;
    post.post_type = post_type || post.post_type;
    post.category = category || post.category;
    post.tags = tags || post.tags;

    // Save the updated post
    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error in updating post:", error.message);
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
    const posts = await Post.find()
      .sort({ _id: -1 })
      .populate("user_id", "name profile_pic_url occupation");
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
    const posts = await Post.find(user_id)
      .sort({ _id: -1 })
      .populate("user_id", "name profile_pic_url occupation");
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
    const posts = await Post.find(user_id)
      .sort({ _id: -1 })
      .populate("user_id", "name profile_pic_url occupation");
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
