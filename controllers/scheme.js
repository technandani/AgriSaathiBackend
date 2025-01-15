const Scheme = require('../models/scheme');
const cloudinary = require('cloudinary').v2; 
const { uploadToCloudinary } = require("../utils/cloudinary");

const createScheme = async (req, res) => {
  try {
    const {
      scheme_name,
      short_description,
      long_description,
      scheme_type,
      eligibility_criteria,
      necessary_documents,
      benefits_of_scheme,
      application_process,
      apply_button_url,
      documentation_url,
      start_date,
      end_date,
      state_specific,
      applicable_states,
      tags,
    } = req.body;

    // Upload logo if present
    const logo = req.files?.logo
      ? await uploadToCloudinary(req.files.logo[0].buffer, "schemes/logos")
      : null;

    // Upload images if present
    const images = req.files?.images
      ? await Promise.all(
          req.files.images.map((file) =>
            uploadToCloudinary(file.buffer, "schemes/images")
          )
        )
      : [];

    const newScheme = new Scheme({
      scheme_name,
      short_description,
      long_description,
      scheme_type,
      eligibility_criteria,
      necessary_documents,
      benefits_of_scheme,
      application_process,
      apply_button_url,
      documentation_url,
      start_date,
      end_date,
      logo: logo ? { url: logo.secure_url, public_id: logo.public_id } : null,
      images: images.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      })),
      state_specific,
      applicable_states,
      tags,
    });

    const savedScheme = await newScheme.save();
    res.status(201).json({
      success: true,
      message: "Scheme created successfully.",
      data: savedScheme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating scheme.",
      error: error.message,
    });
  }
};


//retrieving scheme from database
const getSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.status(200).json({
      success: true,
      message: 'Schemes retrieved successfully.',
      data: schemes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving schemes.',
      error: error.message
    });
  }
};

//updatation logic for schemes
const updateScheme = async (req, res) => {
  try {
    const { scheme_id } = req.params;
    const updates = req.body;

    if (req.files?.logo) {
      const logo = req.files?.logo
      ? await uploadToCloudinary(req.files.logo[0].buffer, "schemes/logos")
      : null;
      updates.logo = logo.secure_url;
    }

    if (req.files?.images) {
      const images = req.files?.images
      ? await Promise.all(
          req.files.images.map((file) =>
            uploadToCloudinary(file.buffer, "schemes/images")
          )
        )
      : [];
      updates.images = images.map(img => img.secure_url);
    }

    const updatedScheme = await Scheme.findOneAndUpdate(
      { scheme_id },
      updates,
      { new: true } 
    );

    if (!updatedScheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Scheme updated successfully.',
      data: updatedScheme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating scheme.',
      error: error.message
    });
  }
};

//deletion logic for schemes
const deleteScheme = async (req, res) => {
  try {
    const { scheme_id } = req.params;

    const scheme = await Scheme.findOne({ scheme_id });

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found.",
      });
    }

    // Check logo public_id
    console.log("Logo Public ID:", scheme.logo?.public_id);
    if (scheme.logo && scheme.logo.public_id) {
      await cloudinary.uploader.destroy(scheme.logo.public_id);
    }

    // Check images public_id
    if (scheme.images && scheme.images.length > 0) {
      for (const img of scheme.images) {
        console.log("Image Public ID:", img.public_id);
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    // Delete scheme from database
    await Scheme.deleteOne({ scheme_id });

    res.status(200).json({
      success: true,
      message: "Scheme deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting scheme.",
      error: error.message,
    });
  }
};

module.exports = {
  createScheme,
  getSchemes,
  updateScheme,
  deleteScheme
};