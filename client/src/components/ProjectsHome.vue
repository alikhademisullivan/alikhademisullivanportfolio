<template>
  <div>
    <h1>Projects</h1>
    <button @click="showAddProjectPopup = true">Add New Project</button>
    <div v-if="showAddProjectPopup" class="popup">
      <div class="popup-content">
        <h2>Add New Project</h2>
        <form @submit.prevent="addProject">
          <input v-model="newProject.name" placeholder="Project Name" required />
          <input v-model="newProject.githublink" placeholder="GitHub Link" required />
          <textarea v-model="newProject.Description" placeholder="Description"></textarea>
          <input type="file" @change="handleFileUpload" />
          <button type="submit">Add Project</button>
          <button @click="showAddProjectPopup = false">Cancel</button>
        </form>
      </div>
    </div>

    <div v-if="showEditProjectPopup" class="popup">
      <div class="popup-content">
        <h2>Edit Project</h2>
        <form @submit.prevent="editProjectDetails">
          <input v-model="editProject.name" placeholder="Project Name" required />
          <input v-model="editProject.githublink" placeholder="GitHub Link" required />
          <textarea v-model="editProject.Description" placeholder="Description"></textarea>
          <input type="file" @change="handleEditFileUpload" />

          <button type="submit">Save Changes</button>
          <button @click="showEditProjectPopup = false">Cancel</button>
        </form>
      </div>
    </div>


    <ul class="project-list">
      <li v-for="project in projects" :key="project._id" class="project-item">
        <img v-if="project.Image" :src="`http://localhost:5000/images/${project.Image.data}`" alt="Project Image" class="project-image" />
        <h3>{{ project.name }}</h3>

        <p>{{ project.Description }}</p>
        <a :href="project.githublink" target="_blank">GitHub Link</a>
        <button @click="openEditProjectPopup(project)">Edit</button>
        <button @click="deleteProject(project._id)">Delete</button>


      </li>
    </ul>
  </div>
</template>

  
  <script>

import ProjectService from '../services/ProjectsService';

export default {
  name: 'ProjectsHome',
  data() {
  return {
    projects: [],
    showAddProjectPopup: false,
    showEditProjectPopup: false,
    newProject: {
      name: '',
      githublink: '',
      Description: '',
      Image: null
    },
    editProject: {
      id: '',
      name: '',
      githublink: '',
      Description: '',
      Image: null
    }
  };
},
methods: {
  async fetchProjects() {
    try {
      const response = await ProjectService.getAllProjects();
      this.projects = response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  },
  handleFileUpload(event) {
    this.newProject.Image = event.target.files[0];
  },
  handleEditFileUpload(event) {
    this.editProject.Image = event.target.files[0];
  },
  async addProject() {
    const formData = new FormData();
    formData.append('name', this.newProject.name);
    formData.append('githublink', this.newProject.githublink);
    formData.append('Description', this.newProject.Description);
    if (this.newProject.Image) {
      formData.append('Image', this.newProject.Image);
    }

    try {
      await ProjectService.addProject(formData);
      this.showAddProjectPopup = false;
      this.fetchProjects(); // Refresh the project list
    } catch (error) {
      console.error('Error adding project:', error);
    }
  },
  async deleteProject(projectId) {
      try {
        await ProjectService.deleteProject(projectId);
        // Refresh the project list
        const response = await ProjectService.getAllProjects();
        this.projects = response.data;
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    },
  async editProjectDetails() {
    const formData = new FormData();
    formData.append('name', this.editProject.name);
    formData.append('githublink', this.editProject.githublink);
    formData.append('Description', this.editProject.Description);
    if (this.editProject.Image) {
      formData.append('Image', this.editProject.Image);
    }

    try {
      await ProjectService.editProject(this.editProject._id, formData);
      this.showEditProjectPopup = false;
      this.fetchProjects(); // Refresh the project list
    } catch (error) {
      console.error('Error editing project:', error);
    }
  },
  openEditProjectPopup(project) {
    this.editProject = { ...project, Image: null };
    this.showEditProjectPopup = true;
  }
},
mounted() {
  this.fetchProjects();
}

};

  </script>


<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f0f4f8;
  margin: 0;
  padding: 0;
}

h1 {
  color: #2e7d32;
  text-align: center;
  margin-top: 20px;
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

button:hover {
  background-color: #1b5e20;
}

.project-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.project-item {
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 10px;
  margin: 10px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  text-align: center; /* Center content inside project-item */
}

.project-item img {
  max-width: 100%;
  max-height: 150px;
  margin-bottom: 15px;
  border-radius: 5px;
}

.project-item h3 {
  margin: 0 0 10px 0;
  color: #2e7d32;
  font-size: 20px;
}

.project-item p {
  margin: 0 0 10px 0;
  color: #555;
}

.project-item a {
  color: #2e7d32;
  text-decoration: none;
  font-weight: bold;
}

.project-item a:hover {
  text-decoration: underline;
}




</style>



<style scoped src="../css/popup.css"></style>









