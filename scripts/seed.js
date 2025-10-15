// scripts/seed.js

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Activity from "../models/Activity.js";
import connectDB from "../lib/db.js";

async function run() {
  await connectDB();
  console.log("Connected to DB for seeding");

  // create admin
  const adminEmail = "admin@example.com";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashed = await bcrypt.hash("adminpassword", 10);
    admin = new User({
      name: "Admin",
      email: adminEmail,
      password: hashed,
      isAdmin: true,
    });
    await admin.save();
    console.log("Created admin", adminEmail, "password: adminpassword");
  } else {
    console.log("Admin already exists:", adminEmail);
  }

  // create sample activities if none
  const count = await Activity.countDocuments();
  if (count === 0) {
    const sample = [
      {
        title: "Yoga Session",
        description: "Morning yoga",
        date: new Date(Date.now() + 86400000),
        capacity: 10,
      },
      {
        title: "Coding Workshop",
        description: "Intro to Node.js",
        date: new Date(Date.now() + 2 * 86400000),
        capacity: 25,
      },
      {
        title: "Art Class",
        description: "Watercolors",
        date: new Date(Date.now() + 3 * 86400000),
        capacity: 15,
      },
    ];
    await Activity.insertMany(sample);
    console.log("Inserted sample activities");
  } else {
    console.log("Activities already exist:", count);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
