// server/server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware bazë
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rruga testuese
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "CareerLink API po punon 🚀" });
});

// Nis serverin
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveri po dëgjon në http://localhost:${PORT}`);
});
