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
  getResumeUrl() {
    return `${process.env.VUE_APP_API_URL}/auth/resume`;
  },

  register(user) {
    return apiClient.post('/auth/register', user);
  },

  login(user) {
    return apiClient.post('/auth/login', user).then(response => {
      localStorage.setItem('token', response.data.token);
      if (response.data.isAdmin) {
        localStorage.setItem('isAdmin', response.data.isAdmin);
      }
      return response;
    });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  isAdmin() {
    return !!localStorage.getItem('isAdmin');
  },

  getUsers() {
    const token = localStorage.getItem('token');
    return apiClient.get('/auth/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  updateUser(user) {
    const token = localStorage.getItem('token');
    return apiClient.put(`/auth/users/${user._id}`, user, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  uploadResume(formData) {
    const token = localStorage.getItem('token');
    return apiClient.post('/auth/uploadResume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
  }
};
