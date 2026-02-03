<template>
  <div class="projects-container">
    <section class="projects-header">
      <div class="container">
        <h1>My Projects</h1>
        <p>A showcase of my work and learning journey</p>
      </div>
    </section>

    <section class="projects-section">
      <div class="container">
        <div v-if="isAdmin && isAuthenticated" class="admin-controls">
          <button @click="showAddForm = !showAddForm" class="btn btn-primary">
            {{ showAddForm ? 'Cancel' : '+ Add New Project' }}
          </button>
        </div>

        <!-- Add Project Form -->
        <div v-if="showAddForm && isAdmin" class="form-container">
          <h2>{{ newProject._id ? 'Edit Project' : 'Add New Project' }}</h2>
          <form @submit.prevent="addProject" class="project-form">
            <div class="form-group">
              <label>Project Name</label>
              <input v-model="newProject.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Short Description</label>
              <input v-model="newProject.description" type="text" required />
            </div>
            <div class="form-group">
              <label>Long Description</label>
              <textarea v-model="newProject.longDescription" rows="5"></textarea>
            </div>
            <div class="form-group">
              <label>Technologies (comma-separated)</label>
              <input v-model="newProject.technologiesInput" type="text" placeholder="React, Node.js, MongoDB" />
            </div>
            <div class="form-group">
              <label>GitHub Link <span class="optional">(Optional)</span></label>
              <input v-model="newProject.githubLink" type="url" />
            </div>
            <div class="form-group">
              <label>Live Demo Link <span class="optional">(Optional)</span></label>
              <input v-model="newProject.liveLink" type="url" />
            </div>
            <div class="form-group">
              <label>Image URL <span class="optional">(Optional)</span></label>
              <input v-model="newProject.imageUrl" type="url" />
            </div>
            <div class="form-group">
              <label>
                <input v-model="newProject.featured" type="checkbox" />
                Featured Project
              </label>
            </div>
            <button type="submit" class="btn btn-primary">{{ newProject._id ? 'Update Project' : 'Add Project' }}</button>
          </form>
        </div>

        <!-- Projects Grid -->
        <div class="projects-grid">
          <div v-for="project in projects" :key="project._id" class="project-card">
            <div class="project-image" v-if="isValidField(project.imageUrl)">
              <img :src="project.imageUrl" :alt="project.name" />
              <div class="featured-badge" v-if="project.featured">Featured</div>
            </div>
            <div class="project-content">
              <h3>{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>
              <p v-if="project.longDescription" class="project-long-desc">{{ project.longDescription }}</p>
              
              <div v-if="project.technologies && project.technologies.length" class="technologies">
                <span v-for="tech in project.technologies" :key="tech" class="tech-badge">
                  {{ tech }}
                </span>
              </div>

              <div class="project-actions">
                <div class="project-links">
                  <a v-if="isValidField(project.githubLink)" :href="project.githubLink" target="_blank" class="link-btn github">
                    <i class="fab fa-github"></i> GitHub
                  </a>
                  <a v-if="isValidField(project.liveLink)" :href="project.liveLink" target="_blank" class="link-btn live">
                    <i class="fas fa-globe"></i> Live Demo
                  </a>
                </div>
                <div v-if="isAdmin && isAuthenticated" class="admin-buttons">
                  <button @click="editProject(project)" class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteProject(project._id)" class="btn-icon delete" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="projects.length === 0" class="no-projects">
          <p>No projects yet. Check back soon!</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ProjectService from '../services/ProjectsService';
import AuthService from '../services/AuthService';

export default {
  name: 'ProjectsHome',
  data() {
    return {
      projects: [],
      newProject: {
        name: '',
        description: '',
        longDescription: '',
        technologiesInput: '',
        technologies: [],
        githubLink: '',
        liveLink: '',
        imageUrl: '',
        featured: false,
        order: 0
      },
      showAddForm: false,
      isAdmin: AuthService.isAdmin(),
      isAuthenticated: AuthService.isAuthenticated()
    };
  },
  methods: {
    isValidField(value) {
      return value && value !== 'undefined' && value.trim && value.trim() !== '';
    },
    async fetchProjects() {
      try {
        const response = await ProjectService.getAllProjects();
        this.projects = response.data.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      } catch (error) {
        console.error('Error fetching projects:', error?.response?.data || error);
        alert(`Failed to load projects: ${this.getErrorMessage(error)}`);
      }
    },
    async addProject() {
      try {
        const formData = new FormData();
        formData.append('name', this.newProject.name || '');
        formData.append('description', this.newProject.description || '');
        formData.append('longDescription', this.newProject.longDescription || '');
        formData.append('technologies', JSON.stringify(this.newProject.technologiesInput.split(',').map(t => t.trim()).filter(t => t)));
        formData.append('githubLink', this.newProject.githubLink || '');
        formData.append('liveLink', this.newProject.liveLink || '');
        formData.append('imageUrl', this.newProject.imageUrl || '');
        formData.append('featured', this.newProject.featured);

        if (this.newProject._id) {
          await ProjectService.editProject(this.newProject._id, formData);
          alert('Project updated successfully!');
        } else {
          await ProjectService.addProject(formData);
          alert('Project added successfully!');
        }

        await this.fetchProjects();
        this.resetForm();
        this.showAddForm = false;
      } catch (error) {
        console.error('Error adding/editing project:', error?.response?.data || error);
        alert(`Failed to add/edit project: ${this.getErrorMessage(error)}`);
      }
    },
    async deleteProject(projectId) {
      if (!confirm('Are you sure you want to delete this project?')) return;
      
      try {
        await ProjectService.deleteProject(projectId);
        this.projects = this.projects.filter(p => p._id !== projectId);
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error?.response?.data || error);
        alert(`Failed to delete project: ${this.getErrorMessage(error)}`);
      }
    },
    editProject(project) {
      this.newProject = { ...project, technologiesInput: project.technologies.join(', ') };
      this.showAddForm = true;
      window.scrollTo(0, 0);
    },
    resetForm() {
      this.newProject = {
        name: '',
        description: '',
        longDescription: '',
        technologiesInput: '',
        technologies: [],
        githubLink: '',
        liveLink: '',
        imageUrl: '',
        featured: false,
        order: 0
      };
    },
    getErrorMessage(error) {
      if (error?.response) {
        const status = error.response.status;
        const statusText = error.response.statusText || 'Request failed';
        const data = error.response.data || {};
        const message = data.message || data.error || data.msg;
        return message ? `${status}: ${message}` : `${status}: ${statusText}`;
      }
      if (error?.message) {
        return error.message;
      }
      return 'Unknown error';
    }
  },
  mounted() {
    this.fetchProjects();
  }
};
</script>

<style scoped>
.projects-container {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Projects Header */
.projects-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.projects-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: white;
}

.projects-header p {
  font-size: 1.2rem;
  opacity: 0.8;
  color: white;
}

/* Projects Section */
.projects-section {
  padding: 60px 20px;
  background-color: #f9fafb;
}

.admin-controls {
  margin-bottom: 40px;
  text-align: right;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

/* Form Container */
.form-container {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.form-container h2 {
  margin-bottom: 20px;
  color: #1f2937;
  font-size: 1.5rem;
}

.project-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group:last-child {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #1f2937;
}

.form-group label .optional {
  font-weight: 400;
  color: #9ca3af;
  font-size: 0.85rem;
}

.form-group input,
.form-group textarea {
  padding: 10px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 10px;
  cursor: pointer;
  accent-color: #6366f1;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e5e7eb;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15);
}

.project-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #10b981;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.project-content {
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-content h3 {
  font-size: 1.3rem;
  color: #1f2937;
  margin-bottom: 10px;
  font-weight: 600;
}

.project-description {
  color: #374151;
  margin-bottom: 10px;
  line-height: 1.5;
}

.project-long-desc {
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 15px;
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tech-badge {
  background-color: #eef2ff;
  color: #6366f1;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.project-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-top: auto;
}

.project-links {
  display: flex;
  gap: 10px;
  flex: 1;
}

.link-btn {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.link-btn.github {
  background-color: #1f2937;
  color: white;
}

.link-btn.github:hover {
  background-color: #111;
}

.link-btn.live {
  background-color: #6366f1;
  color: white;
}

.link-btn.live:hover {
  background-color: #4f46e5;
}

.admin-buttons {
  display: flex;
  gap: 5px;
}

.btn-icon {
  background-color: white;
  border: 1.5px solid #e5e7eb;
  color: #6b7280;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background-color: #f3f4f6;
  color: #6366f1;
  border-color: #6366f1;
}

.btn-icon.delete:hover {
  background-color: #fee;
  color: #dc2626;
  border-color: #dc2626;
}

.no-projects {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .projects-header h1 {
    font-size: 2rem;
  }

  .project-form {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-links {
    flex-direction: column;
  }
}
</style>
