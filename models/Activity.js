// models/Activity.js
import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);
