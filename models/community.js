const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema(
  {
    community_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
      immutable: true,
    },
    community_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      trim: true,
    },
    profile_pic_url: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/.test(v); // Validate image URL
        },
        message: (props) => `${props.value} is not a valid image URL!`,
      },
    },
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    members_count: {
      type: Number,
      default: 0,
      min: [3, "A community must have at least 3 members including the admin."],
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length >= 3;
        },
        message:
          "A community must have at least 3 members including the admin.",
      },
    },
    medias: {
      type: [String], 
      validate: {
        validator: function (urls) {
          return (
            !urls ||
            urls.every((url) =>
              /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|mp4|mov|avi|webm))$/.test(
                url
              )
            )
          );
        },
        message: "Invalid media URL format.",
      },
    },
    files: {
      type: [String], 
      validate: {
        validator: function (urls) {
          return (
            !urls ||
            urls.every((url) =>
              /^(https?:\/\/.*\.(?:pdf|doc|docx|xls|xlsx|ppt|pptx))$/.test(url)
            )
          );
        },
        message: "Invalid file URL format.",
      },
    },
    events: {
      type: [mongoose.Schema.Types.ObjectId], 
      ref: "Event",
    },
    tags: {
      type: [String],
      default: [],
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
    privacy_type: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Pre-save validation to ensure admin_id is part of members
CommunitySchema.pre("save", function (next) {
  if (!this.members.includes(this.admin_id)) {
    this.members.push(this.admin_id);
  }
  this.members_count = this.members.length; // Update member count
  next();
});

module.exports = mongoose.model("Community", CommunitySchema);
