// pages/api/activities/index.js
import connectDB from "../../../lib/db";
import Activity from "../../../models/Activity";
import protect from "../../../lib/auth";

async function handler(req, res) {
  await connectDB();
  if (req.method === "GET") {
    const activities = await Activity.find().sort({ date: 1 });
    return res.status(200).json({ activities });
  }

  if (req.method === "POST") {
    const { title, description, date, capacity } = req.body;
    if (!title || !date || !capacity)
      return res
        .status(400)
        .json({ error: "title, date and capacity are required" });

    try {
      const activity = new Activity({
        title,
        description: description || "",
        date: new Date(date),
        capacity: Number(capacity),
      });
      await activity.save();
      return res.status(201).json({ activity });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default protect(handler /*, { requireAdmin: true }*/);
