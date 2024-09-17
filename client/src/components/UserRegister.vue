<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div>
          <label for="username">Username:</label>
          <input type="text" v-model="username" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import AuthService from '../services/AuthService';
  
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
          console.log('Registration successful:', response.data);
        } catch (error) {
          console.error('Registration failed:', error);
        }
      }
    }
  };
  </script>
  