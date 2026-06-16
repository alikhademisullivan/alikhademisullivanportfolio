const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/auth');
const cors = require('cors'); // Import the cors package

require('dotenv').config();
const path = require('path');
const fs = require('fs');

fs.mkdirSync(path.join(__dirname, 'public/images'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'public/resumes'), { recursive: true });

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  // Clean up any stale indexes from old schema versions
  try {
    const db = mongoose.connection.db;
    // Try both collection names
    const collectionNames = ['experiences', 'Users.experiences'];
    for (const collName of collectionNames) {
      try {
        const collection = db.collection(collName);
        const indexes = await collection.getIndexes();
        console.log(`Indexes in ${collName}:`, Object.keys(indexes));
        if (indexes.name_1) {
          await collection.dropIndex('name_1');
          console.log(`✓ Dropped stale name_1 index from ${collName} collection`);
        }
      } catch (innerError) {
        // Collection might not exist, continue
      }
    }
  } catch (error) {
    console.log('Error checking indexes:', error.message);
  }
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1); // Exit the process with an error code
});




const defaultOrigins = [
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:5000',
  'https://trim-mix-436100-b6.uc.r.appspot.com',
  'https://alikhs.com',
  'https://www.alikhs.com'
  
];
const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const clientOrigin = (process.env.CLIENT_URL || process.env.VUE_APP_API_URL || '').trim();

app.use(cors({
  origin: [...new Set([...defaultOrigins, ...envOrigins, ...(clientOrigin ? [clientOrigin] : [])])],
  credentials: true
}));

  app.use('/images', express.static(path.join(__dirname, 'public/images')));

  app.use('/resumes', express.static(path.join(__dirname, 'public/resumes')));

  console.log(__dirname);
   
app.use('/auth', authRoutes);

// //for build
app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});
// //for build




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
