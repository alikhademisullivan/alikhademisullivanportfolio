<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Ali Khademi Sullivan</h1>
        <p class="tagline">Software Engineering Student & Full Stack Developer</p>
        <p class="location">London, Ontario, Canada</p>
        <div class="cta-buttons">
          <router-link to="/projects" class="btn btn-primary">View My Work</router-link>
          <a href="#contact" class="btn btn-secondary">Get In Touch</a>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about">
      <div class="container">
        <h2>About Me</h2>
        <div class="about-content">
          <div class="about-text">
            <p>
              I'm a passionate software engineering student at the University of Western Ontario, 
              currently in my final year of the BESc. program. With a strong foundation in full-stack development, 
              I've gained hands-on experience through internships and personal projects.
            </p>
            <p>
              During my co-op term at Bell Canada, I worked as a Software Developer, collaborating with teams 
              to build and maintain scalable web applications. I'm proficient in Java, JavaScript, React, Python, 
              and modern development tools.
            </p>
            <p>
              I'm passionate about creating clean, efficient code and solving complex problems. 
              I'm always eager to learn new technologies and stay current with industry trends.
            </p>
          </div>
          <div class="about-stats">
            <div class="stat-item">
              <span class="stat-number">{{ yearsOfExperience }}+</span>
              <span class="stat-label">Years Experience</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ projectCount }}+</span>
              <span class="stat-label">Projects Completed</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ uniqueTechnologies }}</span>
              <span class="stat-label">Technologies</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="featured-projects">
      <div class="container">
        <h2>Featured Projects</h2>
        <div class="projects-grid">
          <div v-for="project in featuredProjects" :key="project._id" class="project-card">
            <div class="project-image" v-if="project.imageUrl">
              <img :src="project.imageUrl" :alt="project.name" />
            </div>
            <div class="project-content">
              <h3>{{ project.name }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-tech">
                <span v-for="tech in project.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
              </div>
              <div class="project-links">
                <a v-if="project.githubLink" :href="project.githubLink" target="_blank" class="link-btn">GitHub</a>
                <a v-if="project.liveLink" :href="project.liveLink" target="_blank" class="link-btn">Live Demo</a>
              </div>
            </div>
          </div>
        </div>
        <router-link to="/projects" class="view-all">View All Projects →</router-link>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="skills">
      <div class="container">
        <h2>Skills & Technologies</h2>
        <div class="skills-grid">
          <div v-for="skillCategory in skillsData" :key="skillCategory._id" class="skill-category">
            <h4>{{ skillCategory.category }}</h4>
            <div class="skill-list">
              <span v-for="skill in skillCategory.skills" :key="skill" class="skill-tag">{{ skill }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section class="experience">
      <div class="container">
        <h2>Experience</h2>
        <div class="experience-timeline">
          <div v-for="exp in experiences" :key="exp._id" class="experience-item">
            <div class="experience-marker"></div>
            <div class="experience-content">
              <h3>{{ exp.position }}</h3>
              <p class="company">{{ exp.company }}</p>
              <p class="dates">{{ formatDate(exp.startDate) }} - {{ exp.current ? 'Present' : formatDate(exp.endDate) }}</p>
              <p class="description">{{ exp.description }}</p>
              <div v-if="exp.technologies && exp.technologies.length" class="tech-used">
                <span v-for="tech in exp.technologies" :key="tech" class="tech-badge">{{ tech }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-preview">
      <div class="container">
        <h2>Let's Connect</h2>
        <p>Feel free to reach out for opportunities or just to chat about software engineering!</p>
        <div class="contact-methods">
          <a href="mailto:sullivanali03@gmail.com" class="contact-link">
            <i class="fas fa-envelope"></i>
            <span>Email</span>
          </a>
          <a href="https://www.linkedin.com/in/ali-khademi-sullivan-49930b24a/" target="_blank" class="contact-link">
            <i class="fab fa-linkedin"></i>
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/alikhademisullivan" target="_blank" class="contact-link">
            <i class="fab fa-github"></i>
            <span>GitHub</span>
          </a>
        </div>
        <router-link to="/contact" class="btn btn-primary">Send Me a Message</router-link>
      </div>
    </section>
  </div>
</template>

<script>
import ProjectService from '../services/ProjectsService';
import ExperienceService from '../services/ExperienceService';
import SkillsService from '../services/SkillsService';

export default {
  name: 'SiteHome',
  data() {
    return {
      projects: [],
      experiences: [],
      skillsData: [],
      featuredProjects: []
    };
  },
  computed: {
    yearsOfExperience() {
      if (this.experiences.length === 0) return 0;
      // Find the earliest start date
      const earliestDate = this.experiences.reduce((earliest, exp) => {
        const expDate = new Date(exp.startDate);
        return expDate < earliest ? expDate : earliest;
      }, new Date());
      const now = new Date();
      return Math.floor((now - earliestDate) / (365.25 * 24 * 60 * 60 * 1000));
    },
    projectCount() {
      return this.projects.length;
    },
    uniqueTechnologies() {
      const technologies = new Set();
      // Collect from projects
      this.projects.forEach(project => {
        if (project.technologies && Array.isArray(project.technologies)) {
          project.technologies.forEach(tech => technologies.add(tech));
        }
      });
      // Collect from experiences
      this.experiences.forEach(exp => {
        if (exp.technologies && Array.isArray(exp.technologies)) {
          exp.technologies.forEach(tech => technologies.add(tech));
        }
      });
      return technologies.size;
    }
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await ProjectService.getAllProjects();
        this.projects = response.data;
        this.featuredProjects = this.projects.filter(p => p.featured).slice(0, 3);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    async fetchExperiences() {
      try {
        const response = await ExperienceService.getAllExperiences();
        this.experiences = response.data;
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    },
    async fetchSkills() {
      try {
        const response = await SkillsService.getAllSkills();
        this.skillsData = response.data;
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
  },
  mounted() {
    this.fetchProjects();
    this.fetchExperiences();
    this.fetchSkills();
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-container {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 120px 20px;
  text-align: center;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.tagline {
  font-size: 1.5rem;
  margin-bottom: 10px;
  opacity: 0.95;
}

.location {
  font-size: 1.1rem;
  margin-bottom: 40px;
  opacity: 0.85;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary {
  background-color: #fff;
  color: #6366f1;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  border: 2px solid #fff;
  color: #fff;
  background-color: transparent;
}

.btn-secondary:hover {
  background-color: #fff;
  color: #6366f1;
}

/* About Section */
.about {
  padding: 80px 20px;
  background-color: #f9fafb;
}

.about h2,
.featured-projects h2,
.skills h2,
.experience h2,
.contact-preview h2 {
  font-size: 2.5rem;
  margin-bottom: 50px;
  text-align: center;
  color: #1f2937;
}

.about-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 20px;
}

.about-stats {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 10px;
}

.stat-label {
  display: block;
  font-size: 1rem;
  color: #6b7280;
}

/* Featured Projects */
.featured-projects {
  padding: 80px 20px;
  background-color: #fff;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15);
}

.project-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-content {
  padding: 25px;
}

.project-content h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #1f2937;
}

.project-content p {
  color: #6b7280;
  margin-bottom: 15px;
  line-height: 1.6;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tech-tag {
  background-color: #eef2ff;
  color: #6366f1;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.project-links {
  display: flex;
  gap: 10px;
}

.link-btn {
  flex: 1;
  padding: 10px 12px;
  background-color: #6366f1;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.link-btn:hover {
  background-color: #4f46e5;
  transform: translateY(-2px);
}

.view-all {
  display: block;
  text-align: center;
  color: #6366f1;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.view-all:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* Skills Section */
.skills {
  padding: 80px 20px;
  background-color: #f9fafb;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.skill-category h4 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #1f2937;
  font-weight: 600;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background-color: white;
  border: 2px solid #6366f1;
  color: #6366f1;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background-color: #eef2ff;
}

/* Experience Section */
.experience {
  padding: 80px 20px;
  background-color: #fff;
}

.experience-timeline {
  position: relative;
  padding: 20px 0;
}

.experience-timeline::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #6366f1, #10b981);
}

.experience-item {
  margin-bottom: 40px;
  padding-left: 80px;
  position: relative;
}

.experience-marker {
  position: absolute;
  left: 0;
  top: 5px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.experience-content h3 {
  font-size: 1.3rem;
  color: #1f2937;
  margin-bottom: 5px;
  font-weight: 600;
}

.company {
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 5px;
}

.dates {
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.description {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 15px;
}

.tech-used {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-badge {
  background-color: #d1e7f7;
  color: #0891b2;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Contact Section */
.contact-preview {
  padding: 80px 20px;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  text-align: center;
}

.contact-preview h2 {
  color: white;
}

.contact-preview p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.95;
}

.contact-methods {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-link i {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #10b981;
}

.contact-link:hover {
  transform: translateY(-5px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .tagline {
    font-size: 1.2rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .about-content {
    grid-template-columns: 1fr;
  }

  .about h2,
  .featured-projects h2,
  .skills h2,
  .experience h2,
  .contact-preview h2 {
    font-size: 2rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .experience-timeline::before {
    left: 0;
  }

  .experience-marker {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .experience-item {
    padding-left: 60px;
  }

  .contact-methods {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
