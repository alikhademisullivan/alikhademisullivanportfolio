<template>
  <div id="app">
    <nav class="navbar">
      <router-link class="nav-link" to="/">Home</router-link>
      <router-link class="nav-link" to="/register">Register</router-link>
      <router-link class="nav-link" to="/login">Login</router-link>
      <router-link v-if="isAuthenticated" class="nav-link" to="/admin">Admin</router-link>
    </nav>
    <router-view @login-success="updateAuthStatus"/>
  </div>
</template>

<script>
import AuthService from './services/AuthService';

export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: AuthService.isAuthenticated()
    };
  },
  methods: {
    updateAuthStatus() {
      this.isAuthenticated = AuthService.isAuthenticated();
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #e0f7e9;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4caf50;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #45a049;
}

.nav-link.active {
  background-color: #388e3c;
}
</style>
