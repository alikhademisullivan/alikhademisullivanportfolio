import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/auth',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  register(user) {
    return apiClient.post('/register', user);
  },
  login(user) {
    return apiClient.post('/login', user).then(response => {
      localStorage.setItem('token', response.data.token);
      return response;
    });
  },
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  updateUser(user) {
    const token = localStorage.getItem('token');
    return apiClient.put(`/users/${user.id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  logout() {
    localStorage.removeItem('token');
  },
  
  getUsers() {
    const token = localStorage.getItem('token');
    return apiClient.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

