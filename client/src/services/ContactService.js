import axios from 'axios';

const apiURL = process.env.VUE_APP_API_URL;

const apiClient = axios.create({
  baseURL: apiURL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  submitContact(contactData) {
    return apiClient.post('/auth/contact', contactData);
  },

  getContacts() {
    const token = localStorage.getItem('token');
    return apiClient.get('/auth/contacts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  markAsRead(contactId) {
    const token = localStorage.getItem('token');
    return apiClient.put(`/auth/contacts/${contactId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  deleteContact(contactId) {
    const token = localStorage.getItem('token');
    return apiClient.delete(`/auth/contacts/${contactId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
