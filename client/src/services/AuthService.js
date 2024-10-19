import axios from 'axios';
var url = process.env.VUE_APP_API_URL;
const apiClient = axios.create({
  baseURL: url,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

console.log(".env url "+process.env.VUE_APP_API_URL);




export default {
  
  async getResume(resume) {
    const url = process.env.VUE_APP_API_URL;
    const publicUrl = `${url}/resumes/${resume}`;
    return publicUrl;
  },
  register(user) {
    return apiClient.post('/auth/register', user);
  },
  login(user) {
    return apiClient.post('/auth/login', user).then(response => {

      localStorage.setItem('token', response.data.token);
      if(response.data.isAdmin == true){
        localStorage.setItem('isAdmin', response.data.isAdmin);

      }

      return response;
    });
  },
 

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  isAdmin() {
    return !!localStorage.getItem('isAdmin');
  },
  updateUser(user) {
    const token = localStorage.getItem('token');
    console.log(user._id);
    return apiClient.put(`/auth/users/${user._id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');

  },
  
  getUsers() {
    const token = localStorage.getItem('token');
    return apiClient.get('/auth/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
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

