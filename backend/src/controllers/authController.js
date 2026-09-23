import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =====================================================
// REGISTER
// =====================================================

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check all fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Clean data
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { email: cleanEmail },
        { username: cleanUsername },
      ],
    });

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }

      if (existingUser.username === cleanUsername) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    console.log(
      "New User Created:",
      user._id.toString()
    );

    return res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(
      "Registration Error:",
      error
    );

    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};


// =====================================================
// LOGIN
// =====================================================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing in .env file"
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log(
      "Login User ID:",
      user._id.toString()
    );

    // Send response
    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};