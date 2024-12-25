const express = require("express");
const upload = require("../middlewares/multer"); 
const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getUserPosts,
} = require("../controllers/post");

const router = express.Router();

router.post(
  "/posts",
  upload.array("media_files", 5), // Accept up to 5 files
  createPost
);

router.put("/posts/:post_id", updatePost);
router.delete("/posts/:post_id", deletePost);
router.get("/posts", getAllPosts);
router.get("/posts/:user_id", getUserPosts);

module.exports = router;
