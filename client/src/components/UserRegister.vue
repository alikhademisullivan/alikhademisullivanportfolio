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
  background: linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%);
}

h2 {
  color: #6366f1;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
}

form {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
  width: 100%;
  max-width: 450px;
  border: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #1f2937;
  font-weight: 600;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.register-button {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}
</style>

  