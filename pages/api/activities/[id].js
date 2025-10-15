// pages/api/activities/[id].js
import connectDB from "../../../lib/db";
import Activity from "../../../models/Activity";
import protect from "../../../lib/auth";

async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const activity = await Activity.findById(id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    return res.status(200).json({ activity });
  }

  if (req.method === "PUT") {
    if (!req.user || !req.user.isAdmin)
      return res.status(403).json({ error: "Admin required" });
    const { title, description, date, capacity } = req.body;
    const activity = await Activity.findById(id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });

    if (title !== undefined) activity.title = title;
    if (description !== undefined) activity.description = description;
    if (date !== undefined) activity.date = new Date(date);
    if (capacity !== undefined) activity.capacity = Number(capacity);

    await activity.save();
    return res.status(200).json({ activity });
  }

  if (req.method === "DELETE") {
    if (!req.user || !req.user.isAdmin)
      return res.status(403).json({ error: "Admin required" });
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    return res.status(200).json({ message: "Deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default protect(handler, { requireAdmin: false });
