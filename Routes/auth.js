const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Projects = require('../Models/Projects');
const Experiences = require('../Models/Experiences');
const Contact = require('../Models/Contact');
const Skills = require('../Models/Skills');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const { Storage } = require('@google-cloud/storage');



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
console.log('Mongo uri:', process.env.MONGO_URI);
console.log('url:', process.env.VUE_APP_API_URL);



//resume
// Set up multer for resume uploads
// const resumeStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/resumes');
//   },
//   filename: (req, file, cb) => {
//     cb(null, 'resume.pdf'); // Always save the file as resume.pdf
//   }
// });

// const resumeUpload = multer({ storage: resumeStorage });












// Helper function to clean up optional string fields
const cleanOptionalField = (value) => {
  if (!value || value === 'undefined' || value.trim() === '') {
    return null;
  }
  return value;
};

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





// Create a Google Cloud Storage client
const bucketstorage = new Storage();

const bucketName = 'resumebucketalikhademi'; // Replace with your bucket name
const bucket = bucketstorage.bucket(bucketName); // Replace with your bucket name

const multerStorage = multer.memoryStorage();
const uploadresume = multer({ storage: multerStorage });

async function makeBucketPublic() {
  await bucket.iam.setPolicy({
    bindings: [
      {
        role: 'roles/storage.objectViewer',
        members: [
          'allUsers'
        ]
      }
    ]
  });
  console.log(`Bucket ${bucketName} is now publicly accessible.`);
}

makeBucketPublic().catch(console.error);


router.post('/uploadResume', verifyToken, uploadresume.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const blob = bucket.file('resumes/' + Date.now() + path.extname(req.file.originalname));
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', (err) => {
    console.error('Blob stream error:', err);
    res.status(500).json({ message: 'Upload failed' });
  });

  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.status(200).send({ fileUrl: publicUrl });
  });

  blobStream.end(req.file.buffer);
});








router.get('/resumes/:filename', (req, res) => {
  const { filename } = req.params;
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/resumes/${filename}`;
  res.redirect(publicUrl);
});

router.get('/image/:filename', async (req, res) => {
  const { filename } = req.params;
  const file = bucket.file(`images/${filename}`);

  try {
    await file.exists();
    const publicUrl = `https://storage.googleapis.com/${bucketName}/images/${filename}`;
    res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error('Error fetching image URL:', error);
    res.status(500).json({ message: 'Failed to retrieve image URL' });
  }
});















// router.post('/uploadResume', verifyToken, resumeUpload.single('resume'), (req, res) => {
//   const file = req.file;
//   if (!file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   res.send('Resume uploaded successfully.');
// });












  
  

router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find({}, '_id email username isAdmin');
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

router.put('/editExperience/:id', verifyToken, uploadresume.single('Image'), async (req, res) => {
  const { company, position, description, responsibilities, technologies, startDate, endDate, current, logo } = req.body;
  
  // Handle technologies array
  let techArray = [];
  if (technologies) {
    try {
      techArray = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
    } catch (e) {
      techArray = [];
    }
  }

  let responsibilitiesArray = [];
  if (responsibilities) {
    try {
      responsibilitiesArray = typeof responsibilities === 'string' ? JSON.parse(responsibilities) : responsibilities;
    } catch (e) {
      responsibilitiesArray = [];
    }
  }

  try {
    let experience = await Experiences.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    experience.company = company || experience.company;
    experience.position = position || experience.position;
    experience.description = description || experience.description;
    experience.technologies = techArray.length > 0 ? techArray : experience.technologies;
    experience.responsibilities = responsibilitiesArray.length > 0 ? responsibilitiesArray : experience.responsibilities;
    experience.startDate = startDate || experience.startDate;
    experience.endDate = endDate || experience.endDate;
    experience.current = current !== undefined ? current : experience.current;
    experience.logo = logo || experience.logo;

    await experience.save();
    res.status(200).json({ message: 'Experience updated successfully', experience });
  } catch (err) {
    console.error('Error during experience update:', err);
    res.status(500).json({ message: err.message });
  }
});



router.post('/addExperience', verifyToken, uploadresume.single('Image'), async (req, res) => {
  const { company, position, description, responsibilities, technologies, startDate, endDate, current, logo } = req.body;

  // Handle technologies array
  let techArray = [];
  if (technologies) {
    try {
      techArray = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
    } catch (e) {
      techArray = [];
    }
  }

  let responsibilitiesArray = [];
  if (responsibilities) {
    try {
      responsibilitiesArray = typeof responsibilities === 'string' ? JSON.parse(responsibilities) : responsibilities;
    } catch (e) {
      responsibilitiesArray = [];
    }
  }

  if (req.file) {
    const blob = bucket.file('images/' + Date.now() + path.extname(req.file.originalname));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      console.error('Blob stream error:', err);
      res.status(500).json({ message: 'Upload failed' });
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      const Image = { data: publicUrl, contentType: req.file.mimetype };

      try {
        let experience = new Experiences({ 
          company, 
          position, 
          description, 
          responsibilities: responsibilitiesArray, 
          technologies: techArray, 
          startDate, 
          endDate, 
          current: current || false, 
          logo,
          Image 
        });
        await experience.save();
        console.log('Experience saved:', experience);
        res.status(201).json({ message: 'Experience added successfully', experience });
      } catch (err) {
        console.error('Error during experience addition:', err);
        res.status(500).json({ message: err.message });
      }
    });

    blobStream.end(req.file.buffer);
  } else {
    try {
      const experience = new Experiences({ 
        company, 
        position, 
        description, 
        responsibilities: responsibilitiesArray, 
        technologies: techArray, 
        startDate, 
        endDate, 
        current: current || false, 
        logo
      });
      await experience.save();
      console.log('Experience saved:', experience);
      res.status(201).json({ message: 'Experience added successfully', experience });
    } catch (err) {
      console.error('Error during experience addition:', err);
      res.status(500).json({ message: err.message });
    }
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

router.put('/editProject/:id', verifyToken, uploadresume.single('Image'), async (req, res) => {
  const { name, description, longDescription, technologies, githubLink, liveLink, imageUrl, featured, order } = req.body;

  // Handle technologies array
  let techArray = [];
  if (technologies) {
    try {
      techArray = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
    } catch (e) {
      techArray = [];
    }
  }

  if (req.file) {
    // File upload to Google Cloud Storage
    const blob = bucket.file('images/' + Date.now() + path.extname(req.file.originalname));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      console.error('Blob stream error:', err);
      res.status(500).json({ message: 'Upload failed' });
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      try {
        let project = await Projects.findById(req.params.id);
        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
        }
        project.name = name || project.name;
        project.description = description || project.description;
        project.longDescription = longDescription || project.longDescription;
        project.technologies = techArray.length > 0 ? techArray : project.technologies;
        project.githubLink = githubLink || project.githubLink;
        project.liveLink = liveLink || project.liveLink;
        project.imageUrl = publicUrl;
        project.featured = featured !== undefined ? featured : project.featured;
        project.order = order !== undefined ? order : project.order;

        await project.save();
        res.status(200).json({ message: 'Project updated successfully', project });
      } catch (err) {
        console.error('Error during project update:', err);
        res.status(500).json({ message: err.message });
      }
    });

    blobStream.end(req.file.buffer);
  } else {
    // No file upload, just update text fields
    try {
      let project = await Projects.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      project.name = name || project.name;
      project.description = description || project.description;
      project.longDescription = longDescription || project.longDescription;
      project.technologies = techArray.length > 0 ? techArray : project.technologies;
      project.githubLink = cleanOptionalField(githubLink);
      project.liveLink = cleanOptionalField(liveLink);
      project.imageUrl = cleanOptionalField(imageUrl);
      project.featured = featured !== undefined ? featured : project.featured;
      project.order = order !== undefined ? order : project.order;

      await project.save();
      res.status(200).json({ message: 'Project updated successfully', project });
    } catch (err) {
      console.error('Error during project update:', err);
      res.status(500).json({ message: err.message });
    }
  }
});




router.post('/addProject', verifyToken, uploadresume.single('Image'), (req, res) => {
  const { name, description, longDescription, technologies, githubLink, liveLink, imageUrl, featured, order } = req.body;

  // Handle technologies array
  let techArray = [];
  if (technologies) {
    try {
      techArray = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
    } catch (e) {
      techArray = [];
    }
  }

  // If there's a file, upload it to Google Cloud Storage
  if (req.file) {
    const blob = bucket.file('images/' + Date.now() + path.extname(req.file.originalname));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      console.error('Blob stream error:', err);
      res.status(500).json({ message: 'Upload failed' });
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      try {
        const project = new Projects({
          name,
          description,
          longDescription,
          technologies: techArray,
          githubLink,
          liveLink,
          imageUrl: publicUrl,
          featured: featured || false,
          order: order || 0
        });
        await project.save();
        console.log('Project saved:', project);
        res.status(201).json({ message: 'Project added successfully', project });
      } catch (err) {
        console.error('Error during project addition:', err);
        res.status(500).json({ message: err.message });
      }
    });

    blobStream.end(req.file.buffer);
  } else {
    // No file uploaded, just create project with imageUrl if provided
    try {
      const project = new Projects({
        name,
        description,
        longDescription,
        technologies: techArray,
        githubLink: cleanOptionalField(githubLink),
        liveLink: cleanOptionalField(liveLink),
        imageUrl: cleanOptionalField(imageUrl),
        featured: featured || false,
        order: order || 0
      });
      await project.save();
      console.log('Project saved:', project);
      res.status(201).json({ message: 'Project added successfully', project });
    } catch (err) {
      console.error('Error during project addition:', err);
      res.status(500).json({ message: err.message });
    }
  }
});


// router.post('/addProject', upload.single('Image'), async (req, res) => {
//   const { name, githublink, Description } = req.body;
//   console.log(req.file.filename);
//   const Image = req.file ? { data: req.file.filename, contentType: req.file.mimetype } : null;

//   console.log('Received project addition request:', req.body);

//   try {
//     let project = await Projects.findOne({ name });
//     if (project) {
//       console.log('Project already exists');
//       return res.status(400).json({ message: 'Project already exists' });
//     }

//     project = new Projects({ name, githublink, Description, Image });
//     await project.save();
//     console.log('Project saved:', project);

//     res.status(201).json({ message: 'Project added successfully', project });
//   } catch (err) {
//     console.error('Error during project addition:', err);
//     res.status(500).json({ message: err.message });
//   }
// });




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
      var isAdmin = false;
      user = new User({ username, email, password,isAdmin });
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

    const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
    jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ 
        token,
        isAdmin: user.isAdmin // Send isAdmin status to the frontend
      });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Contact form endpoints
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    await contact.save();
    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/contacts', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/contacts/:id/read', verifyToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/contacts/:id', verifyToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Skills Routes
router.get('/getAllSkills', async (req, res) => {
  try {
    const skills = await Skills.find().sort({ order: 1 });
    res.status(200).json(skills);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/addSkill', verifyToken, async (req, res) => {
  const { category, skills } = req.body;

  if (!category || !skills || !Array.isArray(skills)) {
    return res.status(400).json({ message: 'Category and skills array are required' });
  }

  try {
    const skill = new Skills({
      category,
      skills,
      order: await Skills.countDocuments()
    });
    await skill.save();
    res.status(201).json({ message: 'Skill category added successfully', skill });
  } catch (err) {
    console.error('Error adding skill:', err);
    res.status(500).json({ message: err.message });
  }
});

router.put('/editSkill/:id', verifyToken, async (req, res) => {
  const { category, skills } = req.body;

  try {
    let skill = await Skills.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill category not found' });
    }

    skill.category = category || skill.category;
    skill.skills = skills || skill.skills;

    await skill.save();
    res.status(200).json({ message: 'Skill category updated successfully', skill });
  } catch (err) {
    console.error('Error updating skill:', err);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/deleteSkill/:id', verifyToken, async (req, res) => {
  try {
    const skill = await Skills.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill category not found' });
    }
    res.status(200).json({ message: 'Skill category deleted successfully' });
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
