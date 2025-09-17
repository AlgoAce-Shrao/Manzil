const mongoose = require('mongoose');
const { Schema } = mongoose;

const timelineEventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  note: String,
  type: { type: String, enum: ['admission', 'exam', 'application', 'other'], default: 'other' }
}, { timestamps: true });

module.exports = mongoose.model('TimelineEvent', timelineEventSchema);
