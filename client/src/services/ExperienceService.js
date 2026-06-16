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
  getAllExperiences() {
    return apiClient.get('/auth/getAllExperiences');
  },

  addExperience(formData) {
    const token = localStorage.getItem('token');
    return apiClient.post('/auth/addExperience', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
  },

  editExperience(experienceId, formData) {
    const token = localStorage.getItem('token');
    return apiClient.put(`/auth/editExperience/${experienceId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
  },

  deleteExperience(experienceId) {
    return apiClient.delete(`/auth/deleteExperience/${experienceId}`);
  }
};
