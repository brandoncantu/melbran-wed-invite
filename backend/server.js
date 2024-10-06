const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const inviteRoutes = require('./routes/inviteRoutes');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Add this before your routes
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', inviteRoutes);

// Add this after your API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});