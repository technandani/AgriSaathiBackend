const WeatherRegistration = require("../models/weatherAlertRegistration");

// Register a Weather Alert
const registerWeatherAlert = async (req, res) => {
  const {
    user_id,
    farmer_name,
    mobile_number,
    pincode,
    address,
    occupation,
    register_for,
    relation,
  } = req.body;

  try {
    const newRegistration = new WeatherRegistration({
      user_id,
      farmer_name,
      mobile_number,
      pincode,
      address,
      occupation,
      register_for,
      relation,
    });

    await newRegistration.save();

    res.status(201).json({
      success: true,
      message: "Weather alert registration created successfully.",
      registration: newRegistration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create weather alert registration.",
      error: error.message,
    });
  }
};

// Update a Weather Alert Registration
const updateWeatherAlert = async (req, res) => {
  const { registration_id } = req.params;
  const {
    farmer_name,
    mobile_number,
    pincode,
    address,
    occupation,
    register_for,
    relation,
    status,
  } = req.body;

  try {
    const registration = await WeatherRegistration.findById(registration_id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Weather alert registration not found.",
      });
    }

    // Update fields
    registration.farmer_name = farmer_name || registration.farmer_name;
    registration.mobile_number = mobile_number || registration.mobile_number;
    registration.pincode = pincode || registration.pincode;
    registration.address = address || registration.address;
    registration.occupation = occupation || registration.occupation;
    registration.register_for = register_for || registration.register_for;
    registration.relation = relation || registration.relation;
    registration.status = status || registration.status;

    await registration.save();

    res.status(200).json({
      success: true,
      message: "Weather alert registration updated successfully.",
      registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update weather alert registration.",
      error: error.message,
    });
  }
};

// Delete a Weather Alert Registration
const deleteWeatherAlert = async (req, res) => {
  const { registration_id } = req.params;

  try {
    const registration = await WeatherRegistration.findById(registration_id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Weather alert registration not found.",
      });
    }

    await registration.deleteOne();

    res.status(200).json({
      success: true,
      message: "Weather alert registration deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete weather alert registration.",
      error: error.message,
    });
  }
};

// Get All Weather Alert Registrations created by a paticular user
const getWeatherRegistration = async (req, res) => {
  const { user_id } = req.params;

  try {
    const registrations = await WeatherRegistration.find({ user_id });

    if (registrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No weather alert registrations found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Not yet registered for weather alerts",
      error: error.message,
    });
  }
};

// Get All Weather Alert Registrations 
const getWeatherRegistrations = async (req, res) => {
  const { user_id } = req.params;

  try {
    const registrations = await WeatherRegistration.find();

    if (registrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No weather alert registrations found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch weather alert registrations.",
      error: error.message,
    });
  }
};

module.exports = {
  registerWeatherAlert,
  updateWeatherAlert,
  deleteWeatherAlert,
  getWeatherRegistration,
  getWeatherRegistrations,
};
