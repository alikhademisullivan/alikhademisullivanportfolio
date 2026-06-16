const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/auth');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');
  try {
    const db = mongoose.connection.db;
    for (const collName of ['experiences', 'Users.experiences']) {
      try {
        const collection = db.collection(collName);
        const indexes = await collection.getIndexes();
        if (indexes.name_1) {
          await collection.dropIndex('name_1');
          console.log(`Dropped stale name_1 index from ${collName}`);
        }
      } catch {}
    }
  } catch (error) {
    console.log('Error checking indexes:', error.message);
  }
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1);
});

const defaultOrigins = [
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:5000',
  'https://alikhs.com',
  'https://www.alikhs.com'
];
const envOrigins = (process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
const clientOrigin = (process.env.CLIENT_URL || process.env.VUE_APP_API_URL || '').trim();

app.use(cors({
  origin: [...new Set([...defaultOrigins, ...envOrigins, ...(clientOrigin ? [clientOrigin] : [])])],
  credentials: true
}));

app.use('/auth', authRoutes);

app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
