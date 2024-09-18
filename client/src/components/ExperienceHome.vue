<template>
  <div class="experience-container">
    <h1>Experience</h1>
    <button @click="showAddExperiencePopup = true">Add New Experience</button>
    <div v-if="showAddExperiencePopup" class="popup">
      <div class="popup-content">
        <h2>Add New Experience</h2>
        <form @submit.prevent="addExperience">
          <input v-model="newExperience.name" placeholder="Experience Name" required />
          <textarea v-model="newExperience.Description" placeholder="Description"></textarea>

          <input v-model="newExperience.Company" placeholder="Company" required />
          <input v-model="newExperience.positionName" placeholder="Position Name" required />
          <input type="date" v-model="newExperience.startDate" placeholder="Start Date" required />
          <input type="date" v-model="newExperience.endDate" placeholder="End Date" />

          <input v-model="newExperience.skills" placeholder="Skills (comma separated)" />
          <input type="file" @change="handleFileUpload" />
          <button type="submit">Add Experience</button>
          <button @click="showAddExperiencePopup = false">Cancel</button>
        </form>
      </div>
    </div>

    <div v-if="showEditExperiencePopup" class="popup">
      <div class="popup-content">
        <h2>Edit Experience</h2>
        <form @submit.prevent="editExperienceDetails">
          <input v-model="editExperience.name" placeholder="Experience Name" required />
          <textarea v-model="editExperience.Description" placeholder="Description"></textarea>

          <input v-model="editExperience.Company" placeholder="Company" required />
          <input v-model="editExperience.positionName" placeholder="Position Name" required />
          <input type="date" v-model="editExperience.startDate" placeholder="Start Date" required />
          <input type="date" v-model="editExperience.endDate" placeholder="End Date" />

          <input v-model="editExperience.skills" placeholder="Skills (comma separated)" />
          <input type="file" @change="handleEditFileUpload" />

          <button type="submit">Save Changes</button>
          <button @click="showEditExperiencePopup = false">Cancel</button>
        </form>
      </div>
    </div>

    <ul class="experience-list">
      <li v-for="experience in experiences" :key="experience._id" class="experience-item">
        <img v-if="experience.Image" :src="`http://localhost:5000/images/${experience.Image.data}`" alt="Experience Image" class="experience-image" />
        <h3>{{ experience.name }}</h3>
        <p>{{ experience.positionName }}</p>
        <p>{{ experience.Description }}</p>
        <p>{{ experience.Company }}</p>
        <div class="skills">
          <span v-for="skill in experience.skills" :key="skill" class="skill-badge">{{ skill }}</span>
        </div>
        <p class="dates">
          <span class="start-date">{{ formatDate(experience.startDate) }}</span> - 
          <span class="end-date">{{ formatDate(experience.endDate) }}</span>
        </p>

        <button @click="openEditExperiencePopup(experience)">Edit</button>
        <button @click="deleteExperience(experience._id)">Delete</button>
      </li>
    </ul>
  </div>
</template>
  
    
    <script>
  
  import ExperienceService from '../services/ExperienceService';
  
  export default {
    name: 'ExperienceHome',
    data() {
    return {
      experiences: [],
      showAddExperiencePopup: false,
      showEditExperiencePopup: false,
      newExperience: {
        name: '',
        Description: '',
        Company: '',
        positionName: '',
        startDate: '',
        endDate: '',
        skills: '',
        Image: null
      },
      editExperience: {
        id: '',
        name: '',
        Description: '',
        Company: '',
        positionName: '',
        startDate: '',
        endDate: '',
        skills: '',
        Image: null
      }
    };
  },
  methods: {
    async fetchExperiences() {
      try {
        const response = await ExperienceService.getAllExperiencies();
        this.experiences = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    handleFileUpload(event) {
      this.newExperience.Image = event.target.files[0];
    },
    handleEditFileUpload(event) {
      this.editExperience.Image = event.target.files[0];
    },
    async addExperience() {
      const formData = new FormData();
      formData.append('name', this.newExperience.name);
      formData.append('Description', this.newExperience.Description);
      formData.append('Company', this.newExperience.Company);
      formData.append('positionName', this.newExperience.positionName);
      formData.append('startDate', this.newExperience.startDate);
      formData.append('endDate', this.newExperience.endDate);
      formData.append('skills', this.newExperience.skills.split(',').map(skill => skill.trim()));
      if (this.newExperience.Image) {
        formData.append('Image', this.newExperience.Image);
      }
  
      try {
        await ExperienceService.addExperience(formData);
        this.showAddExperiencePopup = false;
        this.fetchExperiences(); // Refresh the project list
      } catch (error) {
        console.error('Error adding project:', error);
      }
    },
    async deleteExperience(projectId) {
        try {
          await ExperienceService.deleteExperience(projectId);
          // Refresh the project list
          const response = await ExperienceService.getAllExperiencies();
          this.experiences = response.data;
        } catch (error) {
          console.error('Failed to delete project:', error);
        }
      },
      formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    async editExperienceDetails() {
      const formData = new FormData();
      formData.append('name', this.editExperience.name);
      formData.append('Description', this.editExperience.Description);
      formData.append('Company', this.editExperience.Company);
      formData.append('positionName', this.editExperience.positionName);
      formData.append('startDate', this.editExperience.startDate);
      formData.append('endDate', this.editExperience.endDate);
      formData.append('skills', this.editExperience.skills.split(',').map(skill => skill.trim()));
      if (this.editExperience.Image) {
        formData.append('Image', this.editExperience.Image);
      }
  
      try {
        await ExperienceService.editExperience(this.editExperience._id, formData);
        this.showEditExperiencePopup = false;
        this.fetchExperiences(); // Refresh the project list
      } catch (error) {
        console.error('Error editing project:', error);
      }
    },
    openEditExperiencePopup(experience) {
      this.editExperience = { ...experience, Image: null };
      this.showEditExperiencePopup = true;
    }
  },
  mounted() {
    this.fetchExperiences();
  }
  
  };
  
    </script>
  
  
  <style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
}
.skills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 10px 0;
}

.skill-badge {
  background-color: #2e7d32;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 5px;
  font-size: 14px;
}

.dates {
  margin: 10px 0;
  color: #555;
}

.start-date, .end-date {
  font-weight: bold;
}
  body {
  font-family: Arial, sans-serif;
  background-color: #f0f4f8;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

* {
  box-sizing: border-box;
}

.experience-container {
  text-align: center;
  color: #2e7d32;
}
button {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin: 20px auto;
  display: block;
  border-radius: 5px;
  font-size: 16px;
}

header {
  background-color: #2e7d32;
  color: white;
  padding: 20px 0;
}

header h1 {
  margin: 0;
  font-size: 36px;
}

nav ul {
  list-style-type: none;
  padding: 0;
  margin: 10px 0 0 0;
  display: flex;
  justify-content: center;
}

nav ul li {
  margin: 0 15px;
}

nav ul li a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

nav ul li a:hover {
  text-decoration: underline;
}

main {
  padding: 20px;
}

.intro, .about {
  margin: 20px 0;
}

.intro h2, .about h2 {
  color: #1b5e20;
}

.experience-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.experience-item {
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 10px;
  margin: 10px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  text-align: center;
}

.experience-item img {
  max-width: 100%;
  max-height: 150px;
  margin-bottom: 15px;
  border-radius: 5px;
}

.experience-item h3 {
  margin: 0 0 10px 0;
  color: #2e7d32;
  font-size: 20px;
}

.experience-item p {
  margin: 0 0 10px 0;
  color: #555;
}
  </style>
  
  <style scoped src="../css/popup.css"></style>
  
  
  
  
  
  
  
  
  
  
  
  