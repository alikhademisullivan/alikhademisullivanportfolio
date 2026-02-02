<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
    </div>
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
      email: '',
      password: ''
    };
  },
  name: 'UserLogin',
  mounted() {
    if (AuthService.isAdmin()) {
      this.$router.push({ name: 'Admin' });
    }
  },
  methods: {
    async login() {
      try {
         await AuthService.login({
          email: this.email,
          password: this.password
        });
        this.$emit('login-success'); // Emit an event on successful login
        if (AuthService.isAdmin()) {
        this.$router.push({ name: 'Admin' });
        toastr.success('Login Successful!');

        }else{
          this.$router.push({ name: 'SiteHome' });
          toastr.success('Login Successful!');


        }


      } catch (error) {
        toastr.error('Login failed. Please review email and password');

        console.error('Login failed:', error);
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%);
}

.login-box {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
  width: 350px;
  text-align: center;
  border: 1px solid #e5e7eb;
}

h2 {
  color: #6366f1;
  margin-bottom: 30px;
  font-size: 1.8rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #1f2937;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.login-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}
</style>
