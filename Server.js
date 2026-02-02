const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/auth');
const cors = require('cors'); // Import the cors package

require('dotenv').config();
const path = require('path');

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1); // Exit the process with an error code
});




app.use(cors({
    origin: [
      'http://localhost:8082',
      'http://localhost:5000',
      'https://trim-mix-436100-b6.uc.r.appspot.com'
    ],
    credentials: true
  }));

  app.use('/images', express.static(path.join(__dirname, 'public/images')));

  app.use('/resumes', express.static(path.join(__dirname, 'public/resumes')));

  console.log(__dirname);
   
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.use('/auth', authRoutes);

// //for build
app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});
// //for build




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
