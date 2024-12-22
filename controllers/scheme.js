const Scheme = require('../models/scheme');
const cloudinary = require('cloudinary').v2; 
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// creation logic for schemes
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
      tags
    } = req.body;

    console.log("Uploaded Files:", req.files);
    const logo = req.files?.logo?.[0]?.path
      ? await cloudinary.uploader.upload(req.files.logo[0].path, { folder: "schemes/logos" })
      : null;

    const images = req.files?.images
      ? await Promise.all(
          req.files.images.map(file =>
            cloudinary.uploader.upload(file.path, { folder: "schemes/images" })
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
      logo: logo ? logo.secure_url : null,
      images: images.map(img => img.secure_url),
      state_specific,
      applicable_states,
      tags
    });

    const savedScheme = await newScheme.save();
    res.status(201).json({
      success: true,
      message: "Scheme created successfully.",
      data: savedScheme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating scheme.",
      error: error.message
    });
  }
};

//retrieving scheme from database logic 
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
      const logo = await cloudinary.uploader.upload(req.files.logo.path, { folder: 'schemes/logos' });
      updates.logo = logo.secure_url;
    }

    if (req.files?.images) {
      const images = await Promise.all(
        req.files.images.map(image => cloudinary.uploader.upload(image.path, { folder: 'schemes/images' }))
      );
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

    const deletedScheme = await Scheme.findOneAndDelete({ scheme_id });

    if (!deletedScheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Scheme deleted successfully.',
      data: deletedScheme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting scheme.',
      error: error.message
    });
  }
};

module.exports = {
  createScheme,
  getSchemes,
  updateScheme,
  deleteScheme
};