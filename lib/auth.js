// lib/auth.js
import jwt from "jsonwebtoken";
import connectDB from "./db";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in env");

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export default function protect(handler, { requireAdmin = false } = {}) {
  return async (req, res) => {
    try {
      await connectDB();
      const authHeader = req.headers.authorization || "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
      if (!token) return res.status(401).json({ error: "Not authenticated" });

      const decoded = verifyToken(token);
      if (!decoded) return res.status(401).json({ error: "Invalid token" });

      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ error: "User not found" });

      if (requireAdmin && !user.isAdmin) {
        return res.status(403).json({ error: "Admin privileges required" });
      }

      req.user = user;
      return handler(req, res);
    } catch (err) {
      console.error("Auth middleware error", err);
      return res.status(500).json({ error: "Server error" });
    }
  };
}
