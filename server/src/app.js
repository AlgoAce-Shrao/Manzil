const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// const cors = require('cors');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const aiRoutes = require('./routes/ai');
const collegeRoutes = require('./routes/colleges');
const timelineRoutes = require('./routes/timeline');
const adminRoutes = require('./routes/admin');


const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.get("/", (req, res) => {
  res.json({ message: "Career Advisor API is running 🚀" });
});


// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
});

module.exports = app;
