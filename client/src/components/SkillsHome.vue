<template>
  <div class="skills-container">
    <h1>Manage Skills</h1>
    
    <!-- Add/Edit Skill Form -->
    <div v-if="showAddForm" class="form-container">
      <h2>{{ editingSkill ? 'Edit Skill Category' : 'Add New Skill Category' }}</h2>
      <form @submit.prevent="saveSkill" class="skill-form">
        <div class="form-group">
          <label>Category Name</label>
          <input v-model="newSkill.category" placeholder="e.g., Languages, Frontend, Backend" required />
        </div>
        <div class="form-group">
          <label>Skills (comma-separated)</label>
          <textarea v-model="newSkill.skillsInput" placeholder="Java, JavaScript, Python, C++, SQL" required></textarea>
        </div>
        <button type="submit" class="btn-primary">{{ editingSkill ? 'Update' : 'Add' }} Skill Category</button>
        <button type="button" class="btn-secondary" @click="closeForm">Cancel</button>
      </form>
    </div>

    <!-- Add Button -->
    <div v-if="!showAddForm" class="admin-controls">
      <button @click="showAddForm = true" class="btn-primary">+ Add Skill Category</button>
    </div>

    <!-- Skills List -->
    <div class="skills-list">
      <div v-for="skillCategory in skills" :key="skillCategory._id" class="skill-card">
        <h3>{{ skillCategory.category }}</h3>
        <div class="skills-display">
          <span v-for="skill in skillCategory.skills" :key="skill" class="skill-badge">{{ skill }}</span>
        </div>
        <div class="skill-actions">
          <button @click="editSkill(skillCategory)" class="btn-edit">Edit</button>
          <button @click="deleteSkill(skillCategory._id)" class="btn-delete">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="skills.length === 0" class="no-skills">
      <p>No skill categories yet. Create one to get started!</p>
    </div>
  </div>
</template>

<script>
import SkillsService from '../services/SkillsService';
import AuthService from '../services/AuthService';

export default {
  name: 'SkillsHome',
  data() {
    return {
      skills: [],
      showAddForm: false,
      editingSkill: null,
      newSkill: {
        category: '',
        skillsInput: '',
        skills: []
      },
      isAdmin: AuthService.isAdmin(),
      isAuthenticated: AuthService.isAuthenticated()
    };
  },
  methods: {
    async fetchSkills() {
      try {
        const response = await SkillsService.getAllSkills();
        this.skills = response.data;
      } catch (error) {
        console.error('Error fetching skills:', error);
        alert('Failed to fetch skills');
      }
    },
    async saveSkill() {
      try {
        // Parse skills from comma-separated input
        this.newSkill.skills = this.newSkill.skillsInput
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0);

        if (this.newSkill.skills.length === 0) {
          alert('Please enter at least one skill');
          return;
        }

        const skillData = {
          category: this.newSkill.category,
          skills: this.newSkill.skills
        };

        if (this.editingSkill) {
          await SkillsService.editSkill(this.editingSkill._id, skillData);
          alert('Skill category updated successfully!');
        } else {
          await SkillsService.addSkill(skillData);
          alert('Skill category added successfully!');
        }

        this.closeForm();
        this.fetchSkills();
      } catch (error) {
        console.error('Error saving skill:', error);
        alert('Failed to save skill category');
      }
    },
    editSkill(skillCategory) {
      this.editingSkill = skillCategory;
      this.newSkill = {
        category: skillCategory.category,
        skillsInput: skillCategory.skills.join(', '),
        skills: [...skillCategory.skills]
      };
      this.showAddForm = true;
      window.scrollTo(0, 0);
    },
    async deleteSkill(skillId) {
      if (!confirm('Are you sure you want to delete this skill category?')) return;

      try {
        await SkillsService.deleteSkill(skillId);
        alert('Skill category deleted successfully!');
        this.fetchSkills();
      } catch (error) {
        console.error('Error deleting skill:', error);
        alert('Failed to delete skill category');
      }
    },
    closeForm() {
      this.showAddForm = false;
      this.editingSkill = null;
      this.newSkill = {
        category: '',
        skillsInput: '',
        skills: []
      };
    }
  },
  mounted() {
    if (!this.isAuthenticated || !this.isAdmin) {
      this.$router.push({ name: 'SiteHome' });
      return;
    }
    this.fetchSkills();
  }
};
</script>

<style scoped>
.skills-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
}

h1 {
  color: #6366f1;
  margin-bottom: 30px;
  font-size: 2rem;
  text-align: center;
}

/* Form Container */
.form-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  border: 1px solid #e5e7eb;
}

.form-container h2 {
  color: #1f2937;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.skill-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  color: #1f2937;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
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

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
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

.btn-secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

/* Admin Controls */
.admin-controls {
  margin-bottom: 40px;
  text-align: center;
}

/* Skills List */
.skills-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.skill-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
}

.skill-card h3 {
  color: #6366f1;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.skills-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.skill-badge {
  background-color: #eef2ff;
  color: #6366f1;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.skill-actions {
  display: flex;
  gap: 10px;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background-color: #6366f1;
  color: white;
}

.btn-edit:hover {
  background-color: #4f46e5;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
}

.no-skills {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-size: 1.2rem;
}
</style>
