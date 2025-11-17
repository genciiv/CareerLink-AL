// server/server.js
import "dotenv/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import User from "./models/User.js";



const app = express();

// Lidh databazën
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);


// Rruga testuese
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "CareerLink API po punon 🚀" });
});

// Auth routes
app.use("/api/auth", authRoutes);
// DEBUG: shfaq të gjithë user-at
app.get("/api/debug/users", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    console.error("Debug users error:", err.message);
    res.status(500).json({ message: "Gabim debug" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveri po dëgjon në http://localhost:${PORT}`);
});
