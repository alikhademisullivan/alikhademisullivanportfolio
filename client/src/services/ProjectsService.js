import axios from 'axios';
//VUE_APP_API_URL="https://trim-mix-436100-b6.uc.r.appspot.com"

var url = process.env.VUE_APP_API_URL;
console.log("URL: " + url);

const apiClient = axios.create({
  baseURL: url,
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
          Authorization: `Bearer ${token}`,

        }
      });
    },
    editProject(projectId, formData) {
      const token = localStorage.getItem('token');

        return apiClient.put(`/auth/editProject/${projectId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,


          }
        });
      },
      deleteProject(projectId) {
        return apiClient.delete(`/auth/deleteProject/${projectId}`);
      },
      async getImage(image) {
        try {
          const response = await apiClient.get(`/image/${image}`);
          return response.data.url;
        } catch (error) {
          console.error('Error fetching image URL:', error);
        }
      }
    





  };
  

