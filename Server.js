const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/auth');
const cors = require('cors'); // Import the cors package

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080' // Allow requests from your frontend
  }));
   
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/auth', authRoutes);






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
