// pages/api/bookings/me.js
import connectDB from "../../../lib/db";
import Booking from "../../../models/Booking";
import Activity from "../../../models/Activity";
import protect from "../../../lib/auth";

async function handler(req, res) {
  await connectDB();
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const user = req.user;
  const bookings = await Booking.find({ userId: user._id })
    .populate("activityId")
    .sort({ createdAt: -1 });
  return res.status(200).json({ bookings });
}

export default protect(handler);
