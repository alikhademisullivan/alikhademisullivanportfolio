<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="availability-badge">
          <span class="badge-dot"></span>
          Open to Opportunities
        </div>
        <h1>Ali Khademi Sullivan</h1>
        <p class="tagline">Full Stack Developer & Software Engineering Student</p>
        <p class="location"><i class="fas fa-map-marker-alt"></i> Ontario, Canada</p>
        <p class="hero-summary">
          Building scalable web applications with Vue, Node.js & MongoDB.
          Co-op experience at Bell Canada. Final year BESc at Western University.
        </p>
        <div class="cta-buttons">
          <router-link to="/projects" class="btn btn-primary">View My Work</router-link>
          <a :href="resumeUrl" target="_blank" class="btn btn-secondary" v-if="resumeUrl">
            <i class="fas fa-file-pdf"></i> View Resume
          </a>
          <router-link to="/contact" class="btn btn-secondary" v-else>Get In Touch</router-link>
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
              to build and maintain scalable web applications. I'm proficient in Java, JavaScript, Vue, React, Python,
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

        <!-- Loading skeleton -->
        <div v-if="loadingProjects" class="projects-grid">
          <div v-for="n in 3" :key="n" class="project-card skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-content">
              <div class="skeleton-line wide"></div>
              <div class="skeleton-line medium"></div>
              <div class="skeleton-line narrow"></div>
            </div>
          </div>
        </div>

        <div v-else-if="featuredProjects.length" class="projects-grid">
          <div v-for="project in featuredProjects" :key="project._id" class="project-card">
            <div class="project-image" v-if="isValidField(project.imageUrl)">
              <img :src="resolveImageUrl(project.imageUrl)" :alt="project.name" loading="lazy" />
            </div>
            <div class="project-image project-image-placeholder" v-else>
              <i class="fas fa-code"></i>
            </div>
            <div class="project-content">
              <h3>{{ project.name }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-tech">
                <span v-for="tech in project.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
              </div>
              <div class="project-links">
                <a v-if="isValidField(project.githubLink)" :href="project.githubLink" target="_blank" rel="noopener" class="link-btn link-github">
                  <i class="fab fa-github"></i> GitHub
                </a>
                <a v-if="isValidField(project.liveLink)" :href="project.liveLink" target="_blank" rel="noopener" class="link-btn link-live">
                  <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>

        <p v-else class="empty-state">No featured projects yet.</p>
        <router-link to="/projects" class="view-all">View All Projects →</router-link>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="skills">
      <div class="container">
        <h2>Skills & Technologies</h2>
        <div v-if="loadingSkills" class="skills-grid">
          <div v-for="n in 4" :key="n" class="skill-category">
            <div class="skeleton-line medium" style="margin-bottom:12px"></div>
            <div class="skill-list">
              <div v-for="i in 4" :key="i" class="skeleton-tag"></div>
            </div>
          </div>
        </div>
        <div v-else class="skills-grid">
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
        <div v-if="loadingExperiences" class="experience-timeline">
          <div v-for="n in 2" :key="n" class="experience-item">
            <div class="experience-marker"></div>
            <div class="experience-content">
              <div class="skeleton-line wide" style="margin-bottom:8px"></div>
              <div class="skeleton-line medium" style="margin-bottom:8px"></div>
              <div class="skeleton-line narrow"></div>
            </div>
          </div>
        </div>
        <div v-else class="experience-timeline">
          <div v-for="exp in experiences" :key="exp._id" class="experience-item">
            <div class="experience-marker"></div>
            <div class="experience-content">
              <h3>{{ exp.position }}</h3>
              <p class="company">{{ exp.company }}</p>
              <p class="dates">{{ formatDate(exp.startDate) }} – {{ exp.current ? 'Present' : formatDate(exp.endDate) }}</p>
              <p class="exp-description">{{ exp.description }}</p>
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
        <p>Feel free to reach out for opportunities or to chat about software engineering!</p>
        <div class="contact-methods">
          <a href="https://www.linkedin.com/in/ali-khademi-sullivan-49930b24a/" target="_blank" rel="noopener" class="contact-link">
            <i class="fab fa-linkedin"></i>
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/alikhademisullivan" target="_blank" rel="noopener" class="contact-link">
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
import AuthService from '../services/AuthService';

export default {
  name: 'Home',
  data() {
    return {
      projects: [],
      experiences: [],
      skillsData: [],
      featuredProjects: [],
      loadingProjects: true,
      loadingExperiences: true,
      loadingSkills: true,
      resumeUrl: null
    };
  },
  computed: {
    yearsOfExperience() {
      if (!this.experiences.length) return 0;
      const earliest = this.experiences.reduce((min, exp) => {
        const d = new Date(exp.startDate);
        return d < min ? d : min;
      }, new Date());
      return Math.floor((Date.now() - earliest) / (365.25 * 24 * 60 * 60 * 1000));
    },
    projectCount() {
      return this.projects.length;
    },
    uniqueTechnologies() {
      const all = new Set();
      [...this.projects, ...this.experiences].forEach(item => {
        (item.technologies || []).forEach(t => all.add(t));
      });
      return all.size;
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
      } finally {
        this.loadingProjects = false;
      }
    },
    async fetchExperiences() {
      try {
        const response = await ExperienceService.getAllExperiences();
        this.experiences = response.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        this.loadingExperiences = false;
      }
    },
    async fetchSkills() {
      try {
        const response = await SkillsService.getAllSkills();
        this.skillsData = response.data;
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        this.loadingSkills = false;
      }
    },
    resolveImageUrl(url) {
      if (!url) return null;
      if (url.startsWith('http')) return url;
      return `${process.env.VUE_APP_API_URL}${url}`;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    },
    isValidField(value) {
      return value && value !== 'undefined' && value !== null;
    }
  },
  mounted() {
    this.fetchProjects();
    this.fetchExperiences();
    this.fetchSkills();
    this.resumeUrl = AuthService.getResumeUrl();
  }
};
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.home-container { width: 100%; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ── Hero ───────────────────────────────────────────── */
.hero {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 100px 20px 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.availability-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 24px;
  backdrop-filter: blur(4px);
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.3); }
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 12px;
  font-weight: 700;
}

.tagline {
  font-size: 1.4rem;
  margin-bottom: 10px;
  opacity: 0.95;
}

.location {
  font-size: 1rem;
  margin-bottom: 16px;
  opacity: 0.8;
}

.location i { margin-right: 6px; }

.hero-summary {
  font-size: 1.05rem;
  max-width: 560px;
  margin: 0 auto 36px;
  opacity: 0.9;
  line-height: 1.7;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.25s ease;
  cursor: pointer;
}

.btn-primary { background-color: #fff; color: #6366f1; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }

.btn-secondary { border: 2px solid #fff; color: #fff; background: transparent; }
.btn-secondary:hover { background-color: #fff; color: #6366f1; }

/* ── About ──────────────────────────────────────────── */
.about { padding: 80px 20px; background-color: #f9fafb; }

.about h2, .featured-projects h2, .skills h2, .experience h2, .contact-preview h2 {
  font-size: 2.2rem;
  margin-bottom: 48px;
  text-align: center;
  color: #1f2937;
  font-weight: 700;
}

.about-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-text p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 18px;
}

.about-stats { display: flex; flex-direction: column; gap: 28px; }

.stat-item { text-align: center; }

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 6px;
}

.stat-label { display: block; font-size: 0.95rem; color: #6b7280; }

/* ── Featured Projects ──────────────────────────────── */
.featured-projects { padding: 80px 20px; background-color: #fff; }

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(99,102,241,0.08);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(99,102,241,0.14);
}

.project-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
}

.project-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.project-card:hover .project-image img { transform: scale(1.04); }

.project-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #d1d5db;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
}

.project-content { padding: 24px; }

.project-content h3 { font-size: 1.2rem; margin-bottom: 10px; color: #1f2937; }

.project-content p { color: #6b7280; margin-bottom: 14px; line-height: 1.6; font-size: 0.95rem; }

.project-tech { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }

.tech-tag {
  background: #eef2ff;
  color: #6366f1;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-links { display: flex; gap: 10px; }

.link-btn {
  flex: 1;
  padding: 9px 12px;
  text-decoration: none;
  border-radius: 6px;
  text-align: center;
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.link-github { background: #1f2937; color: white; }
.link-github:hover { background: #374151; }
.link-live { background: #6366f1; color: white; }
.link-live:hover { background: #4f46e5; }

.view-all {
  display: block;
  text-align: center;
  color: #6366f1;
  font-size: 1.05rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  margin-top: 8px;
}
.view-all:hover { color: #4f46e5; text-decoration: underline; }

.empty-state { text-align: center; color: #9ca3af; margin-bottom: 24px; }

/* ── Skills ─────────────────────────────────────────── */
.skills { padding: 80px 20px; background-color: #f9fafb; }

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 36px;
}

.skill-category h4 { font-size: 1.1rem; margin-bottom: 14px; color: #1f2937; font-weight: 600; }

.skill-list { display: flex; flex-wrap: wrap; gap: 8px; }

.skill-tag {
  background: white;
  border: 2px solid #e5e7eb;
  color: #374151;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.skill-tag:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

/* ── Experience ─────────────────────────────────────── */
.experience { padding: 80px 20px; background-color: #fff; }

.experience-timeline { position: relative; padding: 10px 0; }

.experience-timeline::before {
  content: '';
  position: absolute;
  left: 29px;
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
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}

.experience-content h3 { font-size: 1.2rem; color: #1f2937; margin-bottom: 4px; font-weight: 600; }
.company { color: #6366f1; font-weight: 600; margin-bottom: 4px; }
.dates { color: #9ca3af; font-size: 0.88rem; margin-bottom: 12px; }
.exp-description { color: #374151; line-height: 1.7; margin-bottom: 14px; font-size: 0.97rem; }

.tech-used { display: flex; flex-wrap: wrap; gap: 6px; }

.tech-badge {
  background: #d1fae5;
  color: #065f46;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 500;
}

/* ── Contact ────────────────────────────────────────── */
.contact-preview {
  padding: 80px 20px;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  text-align: center;
}

.contact-preview h2 { color: white; }

.contact-preview p { font-size: 1.1rem; margin-bottom: 36px; opacity: 0.85; }

.contact-methods { display: flex; justify-content: center; gap: 40px; margin-bottom: 36px; flex-wrap: wrap; }

.contact-link { display: flex; flex-direction: column; align-items: center; color: white; text-decoration: none; transition: all 0.3s ease; gap: 8px; }

.contact-link i { font-size: 2rem; color: #10b981; }

.contact-link:hover { transform: translateY(-4px); }

/* ── Skeletons ──────────────────────────────────────── */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-card { pointer-events: none; }

.skeleton-img {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-content { padding: 24px; }

.skeleton-line {
  height: 14px;
  border-radius: 6px;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line.wide { width: 80%; }
.skeleton-line.medium { width: 60%; }
.skeleton-line.narrow { width: 40%; }

.skeleton-tag {
  display: inline-block;
  width: 60px;
  height: 28px;
  border-radius: 20px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 768px) {
  .hero-content h1 { font-size: 2.2rem; }
  .tagline { font-size: 1.1rem; }
  .cta-buttons { flex-direction: column; align-items: center; }
  .about-content { grid-template-columns: 1fr; gap: 40px; }
  .about h2, .featured-projects h2, .skills h2, .experience h2, .contact-preview h2 { font-size: 1.8rem; }
  .projects-grid { grid-template-columns: 1fr; }
  .experience-timeline::before { left: 0; }
  .experience-marker { width: 40px; height: 40px; }
  .experience-item { padding-left: 56px; }
  .contact-methods { gap: 24px; }
}
</style>
