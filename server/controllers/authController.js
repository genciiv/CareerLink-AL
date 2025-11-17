// server/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// POST /api/auth/register
export async function registerUser(req, res) {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Plotëso emrin, email-in dhe fjalëkalimin" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Ky email është tashmë i regjistruar" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role: role || "candidate",
    });

    const token = generateToken(user._id);

    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      headline: user.headline,
      location: user.location,
      bio: user.bio,
      skills: user.skills,
      experiences: user.experiences,
      projects: user.projects,
    };

    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error("registerUser error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë regjistrimit" });
  }
}

// POST /api/auth/login
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Shkruaj email dhe fjalëkalimin" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email ose fjalëkalim i pasaktë" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ose fjalëkalim i pasaktë" });
    }

    const token = generateToken(user._id);

    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      headline: user.headline,
      location: user.location,
      bio: user.bio,
      skills: user.skills,
      experiences: user.experiences,
      projects: user.projects,
    };

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error("loginUser error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë hyrjes" });
  }
}
