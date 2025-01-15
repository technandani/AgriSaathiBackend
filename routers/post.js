const express = require("express");
const upload = require("../config/multer"); 
const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getUserPosts,
} = require("../controllers/post");

const router = express.Router();

router.post("/createPost", upload.array("media", 10), createPost);
router.put("/posts/:post_id", upload.array("media", 10), updatePost);
router.delete("/posts/:post_id", deletePost);
router.get("/posts", getAllPosts);
router.get("/posts/:user_id", getUserPosts);

module.exports = router;
