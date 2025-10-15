// pages/api/auth/register.js
import connectDB from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed });
    await user.save();

    const token = signToken({ id: user._id });
    return res
      .status(201)
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
