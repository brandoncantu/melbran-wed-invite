const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const inviteRoutes = require('./routes/inviteRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', inviteRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});