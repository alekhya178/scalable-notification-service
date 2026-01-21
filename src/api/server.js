const express = require('express');
const app = express();
const templateRoutes = require('./routes/templateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/api', templateRoutes);

app.use('/api', templateRoutes);
app.use('/api', notificationRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).send('OK'));

// IMPORTANT: This keeps the server alive!
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Service running on port ${PORT}`);
});