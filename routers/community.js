const express = require("express");
const upload = require("../config/multer");
const {
  createCommunity,
  getAllCommunities,
  getAdminCommunities,
  updateCommunity,
  deleteCommunity,
  requestToJoin,
} = require("../controllers/community");

const router = express.Router();

router.post("/create", upload.single("profile_pic"), createCommunity);
router.get("/all", getAllCommunities);
router.get("/all/:admin_id", getAdminCommunities);
router.put("/update/:community_id", updateCommunity);
router.delete("/delete/:community_id", deleteCommunity);
router.post("/request-to-join", requestToJoin);

module.exports = router;
