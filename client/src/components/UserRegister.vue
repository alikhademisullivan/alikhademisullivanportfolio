<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit" class="register-button">Register</button>
    </form>
  </div>
</template>

<script>
import AuthService from '../services/AuthService';
import toastr from 'toastr';
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: 'toast-top-center',
  showDuration: '1000',
  timeOut: '5000',
  extendedTimeOut: '1000',
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut'
};
export default {
  data() {
    return {
      username: '',
      email: '',
      password: ''
    };
  },
  name: 'UserRegister',

  methods: {
    async register() {
      try {
        const response = await AuthService.register({
          username: this.username,
          email: this.email,
          password: this.password
        });
        
        this.$router.push({ name: 'UserLogin' });
        toastr.success('Registration successful! Please login');


        console.log('Registration successful:', response.data);
      } catch (error) {
        toastr.error('Registration failed. Please try again.');

        console.error('Registration failed:', error);
      }
    }
  }
};
</script>






<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

form {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #4caf50;
  outline: none;
}

.register-button {
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.register-button:hover {
  background-color: #45a049;
}
</style>

  