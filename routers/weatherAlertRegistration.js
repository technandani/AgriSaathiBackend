const express = require("express");
const router = express.Router();
const {
  registerWeatherAlert,
  updateWeatherAlert,
  deleteWeatherAlert,
  getWeatherRegistration,
  getWeatherRegistrations,
} = require("../controllers/weatherAlertRegistration");

router.post("/register", registerWeatherAlert);
router.put("/update/:registration_id", updateWeatherAlert);
router.delete("/delete/:registration_id", deleteWeatherAlert);
router.get("/user/:user_id", getWeatherRegistration);
router.get("/AlertRegisteredUsers", getWeatherRegistrations);

module.exports = router;