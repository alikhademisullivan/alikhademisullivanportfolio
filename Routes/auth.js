const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Projects = require('../Models/Projects');
const Experiences = require('../Models/Experiences');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require('multer');
const path = require('path');



// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
console.log('Secret Key:', secretKey);



//resume
// Set up multer for resume uploads
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/resumes');
  },
  filename: (req, file, cb) => {
    cb(null, 'resume.pdf'); // Always save the file as resume.pdf
  }
});

const resumeUpload = multer({ storage: resumeStorage });

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





router.post('/uploadResume', verifyToken, resumeUpload.single('resume'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('Resume uploaded successfully.');
});









  
  

router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find({}, '_id email username');
        res.status(200).json(users);
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ message: 'Error fetching users', error });
    }
  });



//Experiences


router.delete('/deleteExperience/:id', async (req, res) => {
  try {
    
      const experience = await Experiences.findByIdAndDelete(req.params.id);
      if (!experience) {
          return res.status(404).json({ message: 'Experience not found' });
      }
      res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (err) {
      console.error('Error during experience deletion:', err);
      res.status(500).json({ message: err.message });
  }
});

router.put('/editExperience/:id', upload.single('Image'), async (req, res) => {
  const { name, Description,Company,positionName,startDate,endDate,skills } = req.body;
  const Image = req.file ? { data: req.file.filename, contentType: req.file.mimetype } : null;

  try {
    let experience = await Experiences.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    experience.name = name || experience.name;
    experience.skills = skills || experience.skills;
    experience.Company = Company || experience.Company;
    experience.positionName = positionName || experience.positionName;
    experience.startDate = startDate || experience.startDate;
    experience.endDate = endDate || experience.endDate;

    experience.Description = Description || experience.Description;
    if (Image) {
      experience.Image = Image;
    }

    await experience.save();
    res.status(200).json({ message: 'Experience updated successfully', experience });
  } catch (err) {
    console.error('Error during experience update:', err);
    res.status(500).json({ message: err.message });
  }
});


router.post('/addExperience', upload.single('Image'), async (req, res) => {
  const { name, Description,Company,positionName,startDate,endDate,skills } = req.body;
  console.log(req.file.filename);
  const Image = req.file ? { data: req.file.filename, contentType: req.file.mimetype } : null;

  console.log('Received experience addition request:', req.body);

  try {
    let experience = await Experiences.findOne({ name });
    if (experience) {
      console.log('Experience already exists');
      return res.status(400).json({ message: 'Experience already exists' });
    }

    experience = new Experiences({ name, Description,Company,positionName,startDate,endDate,skills,Image });
    await experience.save();
    console.log('Project saved:', experience);

    res.status(201).json({ message: 'Experience added successfully', experience });
  } catch (err) {
    console.error('Error during experience addition:', err);
    res.status(500).json({ message: err.message });
  }
});


// Route to get all projects
router.get('/getAllExperiences', async (req, res) => {
  try {
    const experiences = await Experiences.find();
    res.status(200).json(experiences);
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ message: err.message });
  }
});














  //projects
  

router.delete('/deleteProject/:id', async (req, res) => {
  try {
    
      const project = await Projects.findByIdAndDelete(req.params.id);
      if (!project) {
          return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
      console.error('Error during project deletion:', err);
      res.status(500).json({ message: err.message });
  }
});

router.put('/editProject/:id', upload.single('Image'), async (req, res) => {
  const { name, githublink, Description } = req.body;
  const Image = req.file ? { data: req.file.filename, contentType: req.file.mimetype } : null;

  try {
    let project = await Projects.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.name = name || project.name;
    project.githublink = githublink || project.githublink;
    project.Description = Description || project.Description;
    if (Image) {
      project.Image = Image;
    }

    await project.save();
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (err) {
    console.error('Error during project update:', err);
    res.status(500).json({ message: err.message });
  }
});


router.post('/addProject', upload.single('Image'), async (req, res) => {
  const { name, githublink, Description } = req.body;
  console.log(req.file.filename);
  const Image = req.file ? { data: req.file.filename, contentType: req.file.mimetype } : null;

  console.log('Received project addition request:', req.body);

  try {
    let project = await Projects.findOne({ name });
    if (project) {
      console.log('Project already exists');
      return res.status(400).json({ message: 'Project already exists' });
    }

    project = new Projects({ name, githublink, Description, Image });
    await project.save();
    console.log('Project saved:', project);

    res.status(201).json({ message: 'Project added successfully', project });
  } catch (err) {
    console.error('Error during project addition:', err);
    res.status(500).json({ message: err.message });
  }
});


// Route to get all projects
router.get('/getAllProjects', async (req, res) => {
  try {
    const projects = await Projects.find();
    res.status(200).json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: err.message });
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
      const { email, username } = req.body;
      const updateData = { email, username };

      const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
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
