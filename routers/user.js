const express = require("express");
const { register, login, getUser } = require("../controllers/user");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/userProfile/:user_id", getUser);

module.exports = router;
