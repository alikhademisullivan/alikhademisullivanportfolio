const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Projects = require('../Models/Projects');
const Experiences = require('../Models/Experiences');
const Contact = require('../Models/Contact');
const Skills = require('../Models/Skills');
const Resume = require('../Models/Resume');
const StoredImage = require('../Models/StoredImage');
const ProfilePhoto = require('../Models/ProfilePhoto');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require('multer');

const memoryUpload = multer({ storage: multer.memoryStorage() });
const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';

const cleanOptionalField = (value) => {
  if (!value || value === 'undefined' || value.trim() === '') return null;
  return value;
};

const parseJsonField = (value) => {
  if (!value) return [];
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return [];
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  const tokenPart = token.split(' ')[1];
  jwt.verify(tokenPart, secretKey, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    next();
  });
};

// ─── Resume ──────────────────────────────────────────────────────────────────

router.post('/uploadResume', verifyToken, memoryUpload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  try {
    await Resume.deleteMany({});
    const resume = new Resume({
      data: req.file.buffer,
      contentType: req.file.mimetype,
      filename: req.file.originalname
    });
    await resume.save();
    res.status(200).json({ message: 'Resume uploaded successfully', fileUrl: '/auth/resume' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/resume', async (req, res) => {
  try {
    const resume = await Resume.findOne();
    if (!resume) return res.status(404).json({ message: 'No resume found' });
    res.set('Content-Type', resume.contentType);
    res.set('Content-Disposition', `inline; filename="${resume.filename}"`);
    res.send(resume.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Profile Photo ────────────────────────────────────────────────────────────

router.post('/uploadProfilePhoto', verifyToken, memoryUpload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  try {
    await ProfilePhoto.deleteMany({});
    const photo = new ProfilePhoto({
      data: req.file.buffer,
      contentType: req.file.mimetype,
      filename: req.file.originalname
    });
    await photo.save();
    res.status(200).json({ message: 'Profile photo uploaded successfully', url: '/auth/profilePhoto' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/profilePhoto', async (req, res) => {
  try {
    const photo = await ProfilePhoto.findOne();
    if (!photo) return res.status(404).json({ message: 'No profile photo found' });
    res.set('Content-Type', photo.contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(photo.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Images ───────────────────────────────────────────────────────────────────

router.post('/uploadImage', verifyToken, memoryUpload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  try {
    const image = new StoredImage({
      data: req.file.buffer,
      contentType: req.file.mimetype,
      filename: req.file.originalname
    });
    await image.save();
    res.status(200).json({ imageUrl: `/auth/image/${image._id}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/image/:id', async (req, res) => {
  try {
    const image = await StoredImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Users ────────────────────────────────────────────────────────────────────

router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, '_id email username isAdmin');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const { email, username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { email, username }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ username, email, password, isAdmin: false });
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
    jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, isAdmin: user.isAdmin });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Experiences ──────────────────────────────────────────────────────────────

router.get('/getAllExperiences', async (req, res) => {
  try {
    const experiences = await Experiences.find();
    res.status(200).json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/addExperience', verifyToken, memoryUpload.single('Image'), async (req, res) => {
  const { company, position, description, responsibilities, technologies, startDate, endDate, current, logo } = req.body;
  const techArray = parseJsonField(technologies);
  const responsibilitiesArray = parseJsonField(responsibilities);

  try {
    let imageUrl = null;
    if (req.file) {
      const image = new StoredImage({ data: req.file.buffer, contentType: req.file.mimetype, filename: req.file.originalname });
      await image.save();
      imageUrl = `/auth/image/${image._id}`;
    }

    const experience = new Experiences({
      company, position, description,
      responsibilities: responsibilitiesArray,
      technologies: techArray,
      startDate, endDate,
      current: current || false,
      logo,
      imageUrl
    });
    await experience.save();
    res.status(201).json({ message: 'Experience added successfully', experience });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/editExperience/:id', verifyToken, memoryUpload.single('Image'), async (req, res) => {
  const { company, position, description, responsibilities, technologies, startDate, endDate, current, logo } = req.body;
  const techArray = parseJsonField(technologies);
  const responsibilitiesArray = parseJsonField(responsibilities);

  try {
    const experience = await Experiences.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: 'Experience not found' });

    if (req.file) {
      const image = new StoredImage({ data: req.file.buffer, contentType: req.file.mimetype, filename: req.file.originalname });
      await image.save();
      experience.imageUrl = `/auth/image/${image._id}`;
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
    res.status(500).json({ message: err.message });
  }
});

router.delete('/deleteExperience/:id', async (req, res) => {
  try {
    const experience = await Experiences.findByIdAndDelete(req.params.id);
    if (!experience) return res.status(404).json({ message: 'Experience not found' });
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Projects ─────────────────────────────────────────────────────────────────

router.get('/getAllProjects', async (req, res) => {
  try {
    const projects = await Projects.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/addProject', verifyToken, memoryUpload.single('Image'), async (req, res) => {
  const { name, description, longDescription, technologies, githubLink, liveLink, imageUrl, featured, order } = req.body;
  const techArray = parseJsonField(technologies);

  try {
    let resolvedImageUrl = cleanOptionalField(imageUrl);
    if (req.file) {
      const image = new StoredImage({ data: req.file.buffer, contentType: req.file.mimetype, filename: req.file.originalname });
      await image.save();
      resolvedImageUrl = `/auth/image/${image._id}`;
    }

    const project = new Projects({
      name, description, longDescription,
      technologies: techArray,
      githubLink: cleanOptionalField(githubLink),
      liveLink: cleanOptionalField(liveLink),
      imageUrl: resolvedImageUrl,
      featured: featured || false,
      order: order || 0
    });
    await project.save();
    res.status(201).json({ message: 'Project added successfully', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/editProject/:id', verifyToken, memoryUpload.single('Image'), async (req, res) => {
  const { name, description, longDescription, technologies, githubLink, liveLink, imageUrl, featured, order } = req.body;
  const techArray = parseJsonField(technologies);

  try {
    const project = await Projects.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (req.file) {
      const image = new StoredImage({ data: req.file.buffer, contentType: req.file.mimetype, filename: req.file.originalname });
      await image.save();
      project.imageUrl = `/auth/image/${image._id}`;
    } else if (imageUrl !== undefined) {
      project.imageUrl = cleanOptionalField(imageUrl);
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.longDescription = longDescription || project.longDescription;
    project.technologies = techArray.length > 0 ? techArray : project.technologies;
    project.githubLink = cleanOptionalField(githubLink);
    project.liveLink = cleanOptionalField(liveLink);
    project.featured = featured !== undefined ? featured : project.featured;
    project.order = order !== undefined ? order : project.order;

    await project.save();
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/deleteProject/:id', async (req, res) => {
  try {
    const project = await Projects.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Contact ──────────────────────────────────────────────────────────────────

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const contact = new Contact({ name, email, subject, message });
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
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/contacts/:id', verifyToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Skills ───────────────────────────────────────────────────────────────────

router.get('/getAllSkills', async (req, res) => {
  try {
    const skills = await Skills.find().sort({ order: 1 });
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/addSkill', verifyToken, async (req, res) => {
  const { category, skills } = req.body;
  if (!category || !skills || !Array.isArray(skills)) {
    return res.status(400).json({ message: 'Category and skills array are required' });
  }
  try {
    const skill = new Skills({ category, skills, order: await Skills.countDocuments() });
    await skill.save();
    res.status(201).json({ message: 'Skill category added successfully', skill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/editSkill/:id', verifyToken, async (req, res) => {
  const { category, skills } = req.body;
  try {
    const skill = await Skills.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill category not found' });
    skill.category = category || skill.category;
    skill.skills = skills || skill.skills;
    await skill.save();
    res.status(200).json({ message: 'Skill category updated successfully', skill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/deleteSkill/:id', verifyToken, async (req, res) => {
  try {
    const skill = await Skills.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill category not found' });
    res.status(200).json({ message: 'Skill category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
