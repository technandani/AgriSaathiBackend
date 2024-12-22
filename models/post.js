const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
      immutable: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    title: {
      type: String,
      maxlength: 255,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    post_type: {
      type: String,
      enum: ["Question", "Announcement", "Sell", "Rent", "Other"],
      required: true,
    },
    media_type: {
      type: String,
      enum: ["None", "Image", "Video"],
      default: "None",
    },
    media_urls: {
      type: [String], 
      validate: {
        validator: function (urls) {
          return (
            !urls ||
            urls.every((url) =>
              /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|mp4|mov|avi|webm))$/.test(
                url
              )
            )
          );
        },
        message: (props) => `${props.value} is not a valid media URL!`,
      },
    },
    category: {
      type: String,
      maxlength: 50,
      trim: true,
    },
    tags: {
      type: [String], 
    },
    created_at: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Active", "Closed", "Pending"],
      default: "Active",
    },
    likes_count: {
      type: Number,
      default: 0,
    },
    share_count: {
      type: Number,
      default: 0,
    },
    comments_count: {
      type: Number,
      default: 0,
    },
    views_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Post", PostSchema);