const mongoose = require("mongoose");
require("dotenv").config();

const College = require("../models/College");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/career_advisor_mvp";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear old data
    await College.deleteMany({});
    console.log("🧹 Cleared old colleges");

    const colleges = [
      {
        name: "IIT Bhubaneswar",
        city: "Bhubaneswar",
        state: "Odisha",
        type: "Government",
        courses: [{ name: "Computer Science" }, { name: "Electrical" }, { name: "Mechanical" }],
        location: { type: "Point", coordinates: [85.8161, 20.2961] }, // [lng, lat]
        reviews: [{ rating: 5, text: "Great faculty and campus." }]
      },
      {
        name: "Utkal University",
        city: "Bhubaneswar",
        state: "Odisha",
        type: "Government",
        courses: [{ name: "Commerce" }, { name: "Arts" }, { name: "Law" }],
        location: { type: "Point", coordinates: [85.8194, 20.3550] },
        reviews: [{ rating: 4, text: "Oldest university in Odisha." }]
      },
      {
        name: "KIIT University",
        city: "Bhubaneswar",
        state: "Odisha",
        type: "Private",
        courses: [{ name: "Computer Science" }, { name: "Biotechnology" }, { name: "MBA" }],
        location: { type: "Point", coordinates: [85.8194, 20.3550] },
        reviews: [{ rating: 4, text: "Good placements and infrastructure." }]
      },
      {
        name: "Ravenshaw University",
        city: "Cuttack",
        state: "Odisha",
        type: "Government",
        courses: [{ name: "Economics" }, { name: "History" }, { name: "English" }],
        location: { type: "Point", coordinates: [85.8793, 20.4640] },
        reviews: [{ rating: 5, text: "Heritage campus with strong academics." }]
      },
      {
        name: "Silicon Institute of Technology",
        city: "Bhubaneswar",
        state: "Odisha",
        type: "Private",
        courses: [{ name: "Electronics" }, { name: "Mechanical" }],
        location: { type: "Point", coordinates: [85.8362, 20.2946] },
        reviews: [{ rating: 3, text: "Decent academics but improving." }]
      }
    ];

    await College.insertMany(colleges);
    console.log(`✅ Inserted ${colleges.length} colleges`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
