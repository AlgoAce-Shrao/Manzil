const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Manzil';
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  // mongoose 7 doesn't require useCreateIndex/useFindAndModify
  await mongoose.connect(uri, opts);
  console.log('✅ MongoDB connected');
};

module.exports = connectDB;
