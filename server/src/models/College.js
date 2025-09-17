const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: String,
  eligibility: String
}, { _id: false });

const admissionSchema = new Schema({
  title: String,
  start: Date,
  end: Date
}, { _id: false });

// const collegeSchema = new Schema({
//   name: { type: String, required: true, index: true },
//   state: String,
//   city: String,
//   location: {
//     type: { type: String, enum: ['Point'], default: 'Point' },
//     coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
//   },
//   courses: [courseSchema],
//   admissionDates: [admissionSchema],
//   contact: { phone: String, email: String },
//   facilities: [String]
// }, { timestamps: true });

// collegeSchema.index({ location: '2dsphere' });

const collegeSchema = new mongoose.Schema({
  name: String,
  city: String,
  state: String,
  courses: [{ name: String }],
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  type: { type: String, enum: ["Government", "Private"], default: "Government" },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: Number,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  courses: [courseSchema],
  admissionDates: [admissionSchema],
  contact: { phone: String, email: String },
  facilities: [String]
});
collegeSchema.index({ location: "2dsphere" });


module.exports = mongoose.model('College', collegeSchema);
