const Community = require("../models/community");
const User = require("../models/user");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a new Community
const createCommunity = async (req, res) => {
    const { community_name, description, admin_id, tags, privacy_type, members_count, members } = req.body;
  
    try {

        const admin = await User.findById(admin_id);

        if (!admin) {
          return res.status(404).json({
            success: false,
            message: "Admin user not found.",
          });
        }

        if (members.length < 3) {
            return res.status(400).json({
              success: false,
              message: "A community must have at least 3 members including the admin.",
            });
          }

      // Upload profile picture to Cloudinary
      let profile_pic_url = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "communities/profile_pics",
        });
        profile_pic_url = result.secure_url;
      }
  
      // Create new community
      const newCommunity = new Community({
        community_name,
        description,
        profile_pic_url,
        admin_id,
        members,
        tags,
        privacy_type,
        members_count,
        members,
      });
  
      await newCommunity.save();
  
      res.status(201).json({
        success: true,
        message: "Community created successfully.",
        community: newCommunity,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create community.",
        error: error.message,
      });
    }
  };  

// Get all Communities or filter by tags
const getAllCommunities = async (req, res) => {
  const { tags } = req.query;

  try {
    const query = tags ? { tags: { $in: tags.split(",") } } : {};
    const communities = await Community.find(query).populate("admin_id", "name profile_pic_url");

    res.status(200).json({
      success: true,
      communities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch communities.",
      error: error.message,
    });
  }
};

// Get all Communities created by paticular user
const getAdminCommunities = async (req, res) => {
    const { admin_id } = req.params;
  
    try {
      const communities = await Community.find({admin_id}).populate("admin_id", "name profile_pic_url");
      res.status(200).json({
        success: true,
        communities,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch communities.",
        error: error.message,
      });
    }
  };

// Update a Community
const updateCommunity = async (req, res) => {
  const { community_id } = req.params;
  const { admin_id, community_name, description, profile_pic_url, tags, privacy_type } = req.body;

  try {
    const community = await Community.findById(community_id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    if (community.admin_id.toString() !== admin_id) {
      return res.status(403).json({
        success: false,
        message: "Only the admin can update the community.",
      });
    }

    community.community_name = community_name || community.community_name;
    community.description = description || community.description;
    community.profile_pic_url = profile_pic_url || community.profile_pic_url;
    community.tags = tags || community.tags;
    community.privacy_type = privacy_type || community.privacy_type;

    await community.save();

    res.status(200).json({
      success: true,
      message: "Community updated successfully.",
      community,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update community.",
      error: error.message,
    });
  }
};

// Delete a Community
const deleteCommunity = async (req, res) => {
  const { community_id } = req.params;
  const { admin_id } = req.body;

  try {
    const community = await Community.findById(community_id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    if (community.admin_id.toString() !== admin_id) {
      return res.status(403).json({
        success: false,
        message: "Only the admin can delete the community.",
      });
    }

    await community.deleteOne();

    res.status(200).json({
      success: true,
      message: "Community deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete community.",
      error: error.message,
    });
  }
};

// Request to Join a Community
const requestToJoin = async (req, res) => {
  const { community_id, user_id } = req.body;

  try {
    const community = await Community.findById(community_id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    if (community.privacy_type === "Public") {
      return res.status(400).json({
        success: false,
        message: "This is a public community; you can join directly.",
      });
    }

    if (community.members.includes(user_id)) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this community.",
      });
    }

    // Simulate sending a join request 
    const joinRequest = { user_id, status: "Pending" }; 

    res.status(200).json({
      success: true,
      message: "Join request sent to the admin.",
      request: joinRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send join request.",
      error: error.message,
    });
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  getAdminCommunities,
  updateCommunity,
  deleteCommunity,
  requestToJoin,
};