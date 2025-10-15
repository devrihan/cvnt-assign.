// pages/api/bookings/index.js
import connectDB from "../../../lib/db";
import Booking from "../../../models/Booking";
import Activity from "../../../models/Activity";
import protect from "../../../lib/auth";
import mongoose from "mongoose";

async function handler(req, res) {
  await connectDB();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const user = req.user;
  const { activityId } = req.body;
  if (!activityId)
    return res.status(400).json({ error: "activityId is required" });

  if (!mongoose.Types.ObjectId.isValid(activityId))
    return res.status(400).json({ error: "Invalid activityId" });

  const activity = await Activity.findById(activityId);
  if (!activity) return res.status(404).json({ error: "Activity not found" });

  const currentCount = await Booking.countDocuments({
    activityId: activity._id,
  });
  if (currentCount >= activity.capacity)
    return res.status(400).json({ error: "Activity is full" });

  const already = await Booking.findOne({
    userId: user._id,
    activityId: activity._id,
  });
  if (already)
    return res
      .status(400)
      .json({ error: "You have already booked this activity" });

  try {
    const booking = new Booking({ userId: user._id, activityId: activity._id });
    await booking.save();
    return res.status(201).json({ booking });
  } catch (err) {
    // handle duplicate key (race)
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "You have already booked this activity" });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export default protect(handler);
