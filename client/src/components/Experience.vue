<template>
  <div class="experience-container">
    <section class="experience-header">
      <div class="container">
        <h1>My Experience</h1>
        <p>A timeline of my professional journey</p>
      </div>
    </section>

    <section class="experience-section">
      <div class="container">
        <div v-if="isAdmin && isAuthenticated" class="admin-controls">
          <button @click="showAddForm = !showAddForm" class="btn btn-primary">
            {{ showAddForm ? 'Cancel' : '+ Add Experience' }}
          </button>
        </div>

        <!-- Add Experience Form -->
        <div v-if="showAddForm && isAdmin" class="form-container">
          <h2>{{ newExperience._id ? 'Edit Experience' : 'Add Experience' }}</h2>
          <form @submit.prevent="addExperience" class="experience-form">
            <div class="form-group">
              <label>Company Name</label>
              <input v-model="newExperience.company" type="text" required />
            </div>
            <div class="form-group">
              <label>Position</label>
              <input v-model="newExperience.position" type="text" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="newExperience.description" rows="5" required></textarea>
            </div>
            <div class="form-group">
              <label>Technologies (comma-separated)</label>
              <input v-model="newExperience.technologiesInput" type="text" placeholder="React, Node.js, MongoDB" />
            </div>
            <div class="form-group">
              <label>Start Date</label>
              <input v-model="newExperience.startDate" type="date" required />
            </div>
            <div class="form-group">
              <label>End Date</label>
              <input v-model="newExperience.endDate" type="date" />
            </div>
            <div class="form-group">
              <label>
                <input v-model="newExperience.current" type="checkbox" />
                Currently Working Here
              </label>
            </div>
            <div class="form-group">
              <label>Logo URL</label>
              <input v-model="newExperience.logo" type="url" />
            </div>
            <button type="submit" class="btn btn-primary">
              {{ newExperience._id ? 'Update Experience' : 'Add Experience' }}
            </button>
          </form>
        </div>

        <!-- Experience Timeline -->
        <div class="experience-timeline">
          <div v-for="(exp, index) in experiences" :key="exp._id" class="experience-item">
            <div class="timeline-marker" :style="{ '--index': index }"></div>
            <div class="timeline-content">
              <div class="experience-header-card">
                <div class="company-info">
                  <img v-if="exp.logo" :src="exp.logo" :alt="exp.company" class="company-logo" />
                  <div>
                    <h3>{{ exp.position }}</h3>
                    <p class="company-name">{{ exp.company }}</p>
                    <p class="dates">{{ formatDate(exp.startDate) }} - {{ exp.current ? 'Present' : formatDate(exp.endDate) }}</p>
                  </div>
                </div>
                <div v-if="isAdmin && isAuthenticated" class="admin-buttons">
                  <button @click="editExperience(exp)" class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteExperience(exp._id)" class="btn-icon delete" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <p class="description">{{ exp.description }}</p>
              <div v-if="exp.responsibilities && exp.responsibilities.length" class="responsibilities">
                <h4>Key Responsibilities:</h4>
                <ul>
                  <li v-for="(resp, idx) in exp.responsibilities" :key="idx">{{ resp }}</li>
                </ul>
              </div>
              <div v-if="exp.technologies && exp.technologies.length" class="technologies">
                <span v-for="tech in exp.technologies" :key="tech" class="tech-badge">{{ tech }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="experiences.length === 0" class="no-experiences">
          <p>No experiences yet. Check back soon!</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ExperienceService from '../services/ExperienceService';
import AuthService from '../services/AuthService';

export default {
  name: 'ExperienceHome',
  data() {
    return {
      experiences: [],
      newExperience: {
        company: '',
        position: '',
        description: '',
        technologiesInput: '',
        technologies: [],
        responsibilities: [],
        startDate: '',
        endDate: '',
        current: false,
        logo: ''
      },
      showAddForm: false,
      isAdmin: AuthService.isAdmin(),
      isAuthenticated: AuthService.isAuthenticated()
    };
  },
  methods: {
    async fetchExperiences() {
      try {
        const response = await ExperienceService.getAllExperiences();
        const data = Array.isArray(response.data) ? response.data : response.data?.experiences;
        if (!Array.isArray(data)) {
          throw new Error('Experiences API did not return an array');
        }
        this.experiences = data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      } catch (error) {
        console.error('Error fetching experiences:', error?.response?.data || error);
        alert(`Failed to load experiences: ${this.getErrorMessage(error)}`);
      }
    },
    async addExperience() {
      try {
        const technologies = this.newExperience.technologiesInput
          .split(',')
          .map(t => t.trim())
          .filter(t => t);

        const formData = new FormData();
        formData.append('company', this.newExperience.company || '');
        formData.append('position', this.newExperience.position || '');
        formData.append('description', this.newExperience.description || '');
        formData.append('technologies', JSON.stringify(technologies));
        formData.append('startDate', this.newExperience.startDate || '');
        formData.append('endDate', this.newExperience.endDate || '');
        formData.append('current', this.newExperience.current);
        formData.append('logo', this.newExperience.logo || '');

        if (this.newExperience._id) {
          await ExperienceService.editExperience(this.newExperience._id, formData);
          alert('Experience updated successfully!');
        } else {
          await ExperienceService.addExperience(formData);
          alert('Experience added successfully!');
        }

        await this.fetchExperiences();
        this.resetForm();
        this.showAddForm = false;
      } catch (error) {
        console.error('Error adding/editing experience:', error?.response?.data || error);
        alert(`Failed to add/edit experience: ${this.getErrorMessage(error)}`);
      }
    },
    async deleteExperience(expId) {
      if (!confirm('Are you sure you want to delete this experience?')) return;
      
      try {
        await ExperienceService.deleteExperience(expId);
        this.experiences = this.experiences.filter(e => e._id !== expId);
        alert('Experience deleted successfully!');
      } catch (error) {
        console.error('Error deleting experience:', error?.response?.data || error);
        alert(`Failed to delete experience: ${this.getErrorMessage(error)}`);
      }
    },
    editExperience(exp) {
      this.newExperience = { 
        ...exp,
        startDate: this.formatDateInput(exp.startDate),
        endDate: this.formatDateInput(exp.endDate),
        technologiesInput: exp.technologies ? exp.technologies.join(', ') : ''
      };
      this.showAddForm = true;
      window.scrollTo(0, 0);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    },
    formatDateInput(date) {
      if (!date) return '';
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return '';
      return parsed.toISOString().split('T')[0];
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
    },
    resetForm() {
      this.newExperience = {
        company: '',
        position: '',
        description: '',
        technologiesInput: '',
        technologies: [],
        responsibilities: [],
        startDate: '',
        endDate: '',
        current: false,
        logo: ''
      };
    }
  },
  mounted() {
    this.fetchExperiences();
  }
};
</script>

<style scoped>
.experience-container {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Experience Header */
.experience-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.experience-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.experience-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Experience Section */
.experience-section {
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

.experience-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group:nth-child(3),
.form-group:last-child {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #1f2937;
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

/* Experience Timeline */
.experience-timeline {
  position: relative;
  padding: 40px 0;
}

.experience-timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #6366f1, #10b981);
}

.experience-item {
  margin-bottom: 50px;
  position: relative;
}

.experience-item:nth-child(odd) .timeline-content {
  margin-left: 0;
  margin-right: auto;
  width: calc(50% - 40px);
  text-align: right;
}

.experience-item:nth-child(even) .timeline-content {
  margin-left: auto;
  margin-right: 0;
  width: calc(50% - 40px);
  text-align: left;
}

.timeline-marker {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background-color: white;
  border: 4px solid #6366f1;
  border-radius: 50%;
  box-shadow: 0 0 0 4px #fff, 0 0 0 8px #6366f1;
  z-index: 2;
}

.timeline-content {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.timeline-content:hover {
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
  transform: translateY(-5px);
}

.experience-header-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
}

.company-info {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.company-logo {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.company-info div {
  flex: 1;
}

.company-info h3 {
  font-size: 1.2rem;
  color: #1f2937;
  margin: 0 0 5px 0;
  font-weight: 600;
}

.company-name {
  color: #6366f1;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.dates {
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0;
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

.description {
  color: #374151;
  line-height: 1.8;
  margin: 15px 0;
}

.responsibilities {
  margin: 15px 0;
}

.responsibilities h4 {
  font-size: 0.95rem;
  color: #1f2937;
  margin-bottom: 10px;
  font-weight: 600;
}

.responsibilities ul {
  margin: 0;
  padding-left: 20px;
  color: #374151;
}

.responsibilities li {
  margin-bottom: 5px;
  line-height: 1.6;
}

.technologies {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.tech-badge {
  background-color: #d1e7f7;
  color: #0891b2;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.no-experiences {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .experience-header h1 {
    font-size: 2rem;
  }

  .experience-timeline::before {
    left: 0;
  }

  .experience-item:nth-child(odd) .timeline-content,
  .experience-item:nth-child(even) .timeline-content {
    margin-left: 50px;
    margin-right: 0;
    width: calc(100% - 50px);
    text-align: left;
  }

  .timeline-marker {
    left: 0;
  }

  .experience-form {
    grid-template-columns: 1fr;
  }

  .form-group:nth-child(3),
  .form-group:last-child {
    grid-column: 1;
  }
}
</style>
