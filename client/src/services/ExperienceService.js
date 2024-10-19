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

export default {
    getAllExperiencies() {
      return apiClient.get('/auth/getAllExperiences');
    },
    addExperience(formData) {
        
      return apiClient.post('/auth/addExperience', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    editExperience(experienceid, formData) {
        return apiClient.put(`/auth/editExperience/${experienceid}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      },
      deleteExperience(experienceid) {
        return apiClient.delete(`/auth/deleteExperience/${experienceid}`);
      }
    





  };
  

