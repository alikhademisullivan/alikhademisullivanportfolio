import axios from 'axios';

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
    getAllSkills() {
      return apiClient.get('/auth/getAllSkills');
    },
    addSkill(skillData) {
      const token = localStorage.getItem('token');
      return apiClient.post('/auth/addSkill', skillData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    editSkill(skillId, skillData) {
      const token = localStorage.getItem('token');
      return apiClient.put(`/auth/editSkill/${skillId}`, skillData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    deleteSkill(skillId) {
      const token = localStorage.getItem('token');
      return apiClient.delete(`/auth/deleteSkill/${skillId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
};
