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
    getAllProjects() {
      return apiClient.get('/getAllProjects');
    },
    addProject(formData) {
        
      return apiClient.post('/addProject', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    editProject(projectId, formData) {
        return apiClient.put(`/editProject/${projectId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }





  };
  

