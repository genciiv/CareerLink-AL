// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Nuk je i autorizuar" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "Përdoruesi nuk u gjet" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res
      .status(401)
      .json({ message: "Sesioni ka skaduar ose është i pavlefshëm" });
  }
}

// për kompatibilitet nëse diku përdoret 'protect'
export const protect = requireAuth;
