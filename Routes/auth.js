const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
console.log('Secret Key:', secretKey);

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log('Authorization Header:', token); // Log the authorization header
  
    if (!token) {
      console.log('No token provided');
      return res.status(403).json({ message: 'No token provided' });
    }
  
    const tokenPart = token.split(' ')[1];
    console.log('Token Part:', tokenPart); // Log the token part
  
    jwt.verify(tokenPart, secretKey, (err, decoded) => {
      if (err) {
        console.log('Token verification failed:', err); // Log the error
        return res.status(500).json({ message: 'Failed to authenticate token' });
      }
      console.log('Decoded Token:', decoded); // Log the decoded token
      req.userId = decoded.id;
      next();
    });
  };
  


router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find({}, '_id email username password');
        res.status(200).json(users);
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ message: 'Error fetching users', error });
    }
  });
  
  



// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Received registration request:', req.body);
  
    try {
      let user = await User.findOne({ email });
      if (user) {
        console.log('User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }
  
      user = new User({ username, email, password });
      await user.save();
      console.log('User saved:', user);
  
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error('Error during registration:', err);
      res.status(500).json({ message: err.message });
    }
  });
  
  router.put('/users/:id', verifyToken, async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const updateData = { email, username };
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      await User.findByIdAndUpdate(req.params.id, updateData);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  });
  

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
