<template>
  <div class="admin-container">
    <div class="admin-header">
      <h2>Admin Panel</h2>
      <router-link to="/skills" class="skills-link">Manage Skills</router-link>
    </div>
    <table class="admin-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>isAdmin</th>

          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.email }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.isAdmin }}</td>

          <td>
            <button @click="openEditModal(user)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="upload-section">
      <div class="upload-card">
        <h3>Profile Photo</h3>
        <div v-if="photoPreview" class="photo-preview">
          <img :src="photoPreview" alt="Profile preview" />
        </div>
        <p class="upload-hint">Displays in the hero section of your homepage</p>
        <form @submit.prevent="uploadProfilePhoto">
          <input type="file" accept="image/*" @change="handlePhotoUpload" />
          <button type="submit" :disabled="!photoFile">Upload Photo</button>
        </form>
        <p v-if="photoMessage" class="upload-message" :class="photoSuccess ? 'success' : 'error'">{{ photoMessage }}</p>
      </div>

      <div class="upload-card">
        <h3>Resume (PDF)</h3>
        <p class="upload-hint">Displays as "View Resume" button in the hero section</p>
        <form @submit.prevent="uploadResume">
          <input type="file" accept=".pdf" @change="handleFileUpload" />
          <button type="submit" :disabled="!resumeFile">Upload Resume</button>
        </form>
        <p v-if="resumeMessage" class="upload-message" :class="resumeSuccess ? 'success' : 'error'">{{ resumeMessage }}</p>
      </div>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">×</span>
        <h2>Edit User</h2>
        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" v-model="editUser.email" required />
          </div>
          <div class="form-group">
            <label for="username">Name:</label>
            <input type="text" v-model="editUser.username" required />
          </div>
          <div class="form-group">
            <label for="isAdmin">Admin:</label>
            <input type="checkbox" v-model="editUser.isAdmin" />
          </div>
          <button type="submit" class="save-button">Save</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '../services/AuthService';

export default {
  data() {
    return {
      users: [],
      showModal: false,
      editUser: {
        id: '',
        email: '',
        username: '',
      },
      resumeFile: null,
      resumeMessage: '',
      resumeSuccess: false,
      photoFile: null,
      photoPreview: null,
      photoMessage: '',
      photoSuccess: false
    };
  },
  async created() {
    try {
      const response = await AuthService.getUsers();
      this.users = response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },
  methods: {
    openEditModal(user) {
      console.log(user);
      this.editUser = { ...user };
      this.showModal = true;
    },
    closeEditModal() {
      this.showModal = false;
    },
    async updateUser() {
      try {
        await AuthService.updateUser(this.editUser);
        this.showModal = false;
        // Refresh the user list
        const response = await AuthService.getUsers();
        this.users = response.data;
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    },
    handleFileUpload(event) {
      this.resumeFile = event.target.files[0];
    },
    async uploadResume() {
      if (!this.resumeFile) return;
      const formData = new FormData();
      formData.append('resume', this.resumeFile);
      try {
        await AuthService.uploadResume(formData);
        this.resumeSuccess = true;
        this.resumeMessage = 'Resume uploaded successfully!';
        this.resumeFile = null;
      } catch {
        this.resumeSuccess = false;
        this.resumeMessage = 'Upload failed. Please try again.';
      }
    },
    handlePhotoUpload(event) {
      this.photoFile = event.target.files[0];
      if (this.photoFile) {
        this.photoPreview = URL.createObjectURL(this.photoFile);
      }
    },
    async uploadProfilePhoto() {
      if (!this.photoFile) return;
      const formData = new FormData();
      formData.append('photo', this.photoFile);
      try {
        await AuthService.uploadProfilePhoto(formData);
        this.photoSuccess = true;
        this.photoMessage = 'Profile photo uploaded successfully!';
        this.photoFile = null;
      } catch {
        this.photoSuccess = false;
        this.photoMessage = 'Upload failed. Please try again.';
      }
    }
  },
  name: 'AdminHome'
};
</script>

<style scoped>
.admin-container {
  padding: 40px;
  background: linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  max-width: 1200px;
  margin: 40px auto;
}

h2 {
  color: #6366f1;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
}

h3 {
  color: #6366f1;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto 40px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
}

.admin-table th, .admin-table td {
  padding: 16px;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.admin-table th {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 600;
}

.admin-table tr:nth-child(even) {
  background-color: #f9fafb;
}

.admin-table tr:hover {
  background-color: #eef2ff;
}

button {
  padding: 8px 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  padding: 40px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
  border: 1px solid #e5e7eb;
}

.modal-content h2 {
  font-size: 1.5rem;
  margin-bottom: 25px;
}

.close {
  float: right;
  font-size: 28px;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.3s ease;
}

.close:hover {
  color: #6366f1;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #1f2937;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

input[type="checkbox"] {
  width: auto;
  cursor: pointer;
  accent-color: #6366f1;
}

.save-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.admin-header h2 {
  margin: 0;
  flex: 1;
}

.skills-link {
  padding: 10px 20px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.skills-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.upload-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
}

.upload-card {
  background: white;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
  border: 1px solid #e5e7eb;
}

.upload-card h3 {
  text-align: left;
  margin-bottom: 8px;
}

.upload-hint {
  color: #6b7280;
  font-size: 0.88rem;
  margin-bottom: 16px;
}

.photo-preview {
  margin-bottom: 16px;
}

.photo-preview img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #6366f1;
  display: block;
}

.upload-card input[type="file"] {
  display: block;
  margin-bottom: 12px;
  font-size: 0.9rem;
  border: none;
  padding: 0;
  width: auto;
}

.upload-message {
  margin-top: 10px;
  font-size: 0.9rem;
  font-weight: 500;
}

.upload-message.success { color: #10b981; }
.upload-message.error { color: #ef4444; }

@media (max-width: 768px) {
  .upload-section { grid-template-columns: 1fr; }
}
</style>
