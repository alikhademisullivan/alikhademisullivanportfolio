<template>
  <div class="admin-container">
    <h2>Admin Page</h2>
    <table class="admin-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.email }}</td>
          <td>{{ user.username }}</td>
          <td>
            <button @click="openEditModal(user)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">×</span>
        <h2>Edit User</h2>
        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" v-model="editUser.email" required />
          </div>
          <div class="form-group">
            <label for="username">Name:</label>
            <input type="text" v-model="editUser.username" required />
          </div>
        
          <button type="submit" class="save-button">Save</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '../services/AuthService';

export default {
  data() {
    return {
      users: [],
      showModal: false,
      editUser: {
        id: '',
        email: '',
        username: '',
      }
    };
  },
  async created() {
    try {
      const response = await AuthService.getUsers();
      this.users = response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },
  methods: {
    openEditModal(user) {
      console.log(user);
      this.editUser = { ...user };
      this.showModal = true;
    },
    closeEditModal() {
      this.showModal = false;
    },
    async updateUser() {
      try {
        await AuthService.updateUser(this.editUser);
        this.showModal = false;
        // Refresh the user list
        const response = await AuthService.getUsers();
        this.users = response.data;
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    }
  },
  name: 'AdminHome'
};
</script>

<style scoped>
.admin-container {
  padding: 20px;
  background-color: #e0f7e9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #4caf50;
  text-align: center;
  margin-bottom: 20px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}

.admin-table th, .admin-table td {
  padding: 10px;
  border: 1px solid #cccccc;
  text-align: left;
}

.admin-table th {
  background-color: #4caf50;
  color: white;
}

.admin-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.admin-table tr:hover {
  background-color: #d4edda;
}

button {
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.close {
  float: right;
  font-size: 20px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #333333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.save-button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #45a049;
}
</style>
