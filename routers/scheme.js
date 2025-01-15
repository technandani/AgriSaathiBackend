const express = require("express");
const upload = require("../config/multer");
const {
  createScheme,
  getSchemes,
  updateScheme,
  deleteScheme,
} = require("../controllers/scheme");

const router = express.Router();

router.post(
  "/createScheme",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createScheme
);

router.put(
  "/updateScheme/:scheme_id",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateScheme
);

router.get("/getSchemes", getSchemes);
router.delete("/deleteScheme/:scheme_id", deleteScheme);

module.exports = router;