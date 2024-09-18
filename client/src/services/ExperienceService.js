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
    getAllExperiencies() {
      return apiClient.get('/getAllExperiences');
    },
    addExperience(formData) {
        
      return apiClient.post('/addExperience', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    editExperience(experienceid, formData) {
        return apiClient.put(`/editExperience/${experienceid}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      },
      deleteExperience(experienceid) {
        return apiClient.delete(`/deleteExperience/${experienceid}`);
      }
    





  };
  

