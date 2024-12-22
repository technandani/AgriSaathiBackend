const express = require("express");
const multer = require("multer");
const {
  createScheme,
  getSchemes,
  updateScheme,
  deleteScheme,
} = require("../controllers/scheme");

const router = express.Router();

const upload = multer({ dest: "uploads/" }); 

router.post("/createScheme", upload.fields([{ name: "logo", maxCount: 1 }, { name: "images", maxCount: 10 }]), createScheme);
router.put("/updateScheme/:scheme_id", upload.fields([{ name: "logo", maxCount: 1 }, { name: "images", maxCount: 10 }]), updateScheme);

router.get("/getSchemes", getSchemes);
router.delete("/deleteScheme/:scheme_id", deleteScheme);

module.exports = router;










// const express = require("express");
// const multer = require("multer");
// const {
//   createScheme,
//   getSchemes,
//   updateScheme,
//   deleteScheme,
// } = require("../controllers/scheme");
// const router = express.Router();


// const upload = multer({ dest: "uploads/" });
// const app = express();

// app.use(upload.fields([{ name: "logo" }, { name: "images" }]));

// router.use(express.urlencoded({ extended: false }));

// // Scheme routes
// router.route("/createScheme").post(createScheme);
// router.route("/getSchemes").get(getSchemes);
// router.route("/updateScheme/:scheme_id").put(updateScheme);
// router.route("/deleteScheme/:scheme_id").delete(deleteScheme);

// module.exports = router;
