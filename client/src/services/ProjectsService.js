import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getAllProjects() {
    return apiClient.get('/auth/getAllProjects');
  },

  addProject(formData) {
    const token = localStorage.getItem('token');
    return apiClient.post('/auth/addProject', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
  },

  editProject(projectId, formData) {
    const token = localStorage.getItem('token');
    return apiClient.put(`/auth/editProject/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
  },

  deleteProject(projectId) {
    return apiClient.delete(`/auth/deleteProject/${projectId}`);
  }
};
