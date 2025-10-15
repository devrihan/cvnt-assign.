// models/Booking.js
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

BookingSchema.index({ userId: 1, activityId: 1 }, { unique: true }); // prevents double-booking by DB constraint

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
