const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    phone_no: {
      type: String,
      sparse: true,
      unique: true,
      validate: {
        validator: function (v) {
          return !v || /^\+?[1-9]\d{1,14}$/.test(v); 
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Validate email or allow null
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    pincode: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v); 
        },
        message: (props) => `${props.value} is not a valid pincode!`,
      },
    },
    full_address: {
      type: String,
      trim: true,
    },
    profile_pic_url: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/.test(v); // Validate image URL or allow null
        },
        message: (props) => `${props.value} is not a valid image URL!`,
      },
      default: "https://res.cloudinary.com/dpmengi5q/image/upload/v1734917603/posts/media/cqht9kfisc7xhqwfazfg.jpg",
    },
    profile_banner_url: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/.test(v); // Validate image URL or allow null
        },
        message: (props) => `${props.value} is not a valid image URL!`,
      },
      default: "https://res.cloudinary.com/dpmengi5q/image/upload/v1734917603/posts/media/cqht9kfisc7xhqwfazfg.jpg",
    },
    crops: {
      type: [String], 
    },
    occupation: {
      type: String,
      enum: ["Farmer", "Laborer", "Trader", "Other"],
      default: "Farmer",
    },
    joining_time: {
      type: Date,
      default: Date.now,
    },
    total_posts: {
      type: Number,
      default: 0,
    },
    followers_count: {
      type: Number,
      default: 0,
    },
    following_count: {
      type: Number,
      default: 0,
    },
    experience: {
      type: Number, 
      default: null,
    },
    community_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Community",
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
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("User", UserSchema);