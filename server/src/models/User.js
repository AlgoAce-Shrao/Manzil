const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  passwordHash: { type: String, required: true },
  savedColleges: [{ type: Schema.Types.ObjectId, ref: 'College' }],
  lastQuizResult: { type: Schema.Types.ObjectId, ref: 'QuizResult' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
