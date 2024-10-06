const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const inviteRoutes = require('./routes/inviteRoutes');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;  // Changed to 10000

app.use(cors());
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', inviteRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});