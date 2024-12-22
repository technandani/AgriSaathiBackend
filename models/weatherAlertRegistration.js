const mongoose = require("mongoose");

const WeatherRegistrationSchema = new mongoose.Schema(
  {
    registration_id: {
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
    farmer_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    mobile_number: {
      type: String,
      required: true,
      sparse: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v); 
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    pincode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v); 
        },
        message: (props) => `${props.value} is not a valid pincode!`,
      },
    },
    address: {
      type: String,
      trim: true,
    },
    occupation: {
      type: String,
      enum: ["Farmer", "Laborer", "Other"],
      default: "Farmer",
    },
    register_for: {
      type: String,
      enum: ["Self", "Other"],
      default: "Self",
    },
    relation: {
      type: String,
      trim: true,
      maxlength: 50,
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
      enum: ["Active", "Inactive", "Pending"],
      default: "Active",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("WeatherRegistration", WeatherRegistrationSchema);