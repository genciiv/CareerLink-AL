// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  console.log("Authorization header:", authHeader);

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Nuk je i autorizuar (no token)" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;

    const user = await User.findById(payload.userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Nuk je i autorizuar (user not found)" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res
      .status(401)
      .json({ message: "Nuk je i autorizuar (token invalid ose ka skaduar)" });
  }
}

// alias nëse diku quhet protect
export const protect = requireAuth;

// middleware për role specifike (p.sh. employer)
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Nuk ke të drejta për këtë veprim" });
    }
    next();
  };
}
