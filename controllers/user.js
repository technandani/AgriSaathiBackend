const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); 

const secret = "Nandani@123";
const register = async (req, res) => {
  const { name, email, password, confirmPassword, pincode } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      ...(pincode && { pincode }),
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        name: newUser.name,
        email: newUser.email,
        ...(newUser.pincode && { pincode: newUser.pincode }),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const token = jwt.sign({ email: user.email, _id: user._id }, secret, {
      expiresIn: "120h", 
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
};

module.exports = { register, login };