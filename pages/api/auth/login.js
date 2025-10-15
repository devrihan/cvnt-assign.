// pages/api/auth/login.js
import connectDB from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ id: user._id });
    return res
      .status(200)
      .json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
