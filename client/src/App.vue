<template>
  <div id="app">
    <nav class="navbar">
      <img src="@/assets/logoalikhademisullivan.png" alt="AKS logo" class="profile-image" />

      <router-link class="nav-link" to="/">Home</router-link>
      <router-link class="nav-link" to="/projects">Projects</router-link>
      <router-link class="nav-link" to="/experience">Experience</router-link>
      <router-link class="nav-link" to="/contact">Contact</router-link>

      <router-link v-if="!isAuthenticated" class="nav-link" to="/register">Register</router-link>
      <router-link v-if="!isAuthenticated" class="nav-link" to="/login">Login</router-link>

      <router-link v-if="isAdmin" class="nav-link" to="/admin">Admin</router-link>
      <router-link v-if="isAuthenticated" class="nav-link" to="/logout">Logout</router-link>

    </nav>
    <router-view @login-success="updateAuthStatus"/>

    <footer>
      <p>© 2024 Ali Khademi Sullivan. All rights reserved.</p>
      <p>Contact Me: sullivanali03@gmail.com</p>
      <nav>
        <ul>
          <li><a href="https://www.linkedin.com/in/ali-khademi-sullivan-49930b24a/" target="_blank"><i class="fab fa-linkedin" title="LinkedIn"></i></a></li>
          <li><a  href="https://github.com/alikhademisullivan" target="_blank"><i title="Github" class="fab fa-github"></i></a></li>
        </ul>
      </nav>
    </footer>
  </div>
</template>

<script>
import AuthService from './services/AuthService';

export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: AuthService.isAuthenticated(),
      isAdmin: AuthService.isAdmin()

    };
  },
  methods: {
    updateAuthStatus() {
      this.isAuthenticated = AuthService.isAuthenticated();
      this.isAdmin = AuthService.isAdmin();
    }
  }
};
</script>
<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9fafb;
  color: #1f2937;
}
</style>

<style scoped>
/* Color Theme Variables */
:root {
  --primary: #6366f1;
  --secondary: #10b981;
  --dark: #1f2937;
  --light: #f9fafb;
  --accent: #06b6d4;
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #fff;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 15px 30px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 15px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.3);
  border-bottom: 2px solid #fff;
}

footer {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  padding: 30px 0;
  margin-top: 60px;
  text-align: center;
}

footer p {
  margin: 8px 0;
  font-size: 14px;
}

nav ul {
  list-style-type: none;
  padding: 0;
  margin: 15px 0 0 0;
  display: flex;
  justify-content: center;
  gap: 20px;
}

nav ul li a {
  color: white;
  text-decoration: none;
  font-size: 20px;
  transition: all 0.3s ease;
  opacity: 0.8;
}

nav ul li a:hover {
  opacity: 1;
  transform: scale(1.1);
}
</style>

<style>
/* Custom Toastr Styles */
.toast {
  background-color: #10b981 !important;
  color: #ffffff !important;
  opacity: 1 !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
}

.toast-success {
  background-color: #10b981 !important;
}

.toast-error {
  background-color: #ef4444 !important;
}

.toast-message {
  font-size: 15px !important;
  font-weight: 500 !important;
}
</style>