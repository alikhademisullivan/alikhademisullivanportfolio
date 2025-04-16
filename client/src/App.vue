<template>
  <div id="app">
    <nav class="navbar">
      <img src="@/assets/logoalikhademisullivan.png" alt="AKS logo" class="profile-image" />

      <router-link class="nav-link" to="/">Home</router-link>
      <router-link class="nav-link" to="/projects">Projects</router-link>
      <router-link class="nav-link" to="/experience">Experience</router-link>

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
      this.isAdmin = AuthService.isAuthenticated();

    }
  }
};
</script>
<style>

body {
  margin: 0;
  
}

</style>
<style scoped>
.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
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
footer {
  background-color: #2e7d32;
  color: white;
  padding: 10px 0;
  position: relative; /* Change to relative */
  width: 100%;
  bottom: 0;
  justify-items: center;
}
nav ul {
  list-style-type: none;
  padding: 0;
  margin: 10px 0 0 0;
  display: flex;
  justify-content: center;
}
nav ul li {
  margin: 0 15px;
}

nav ul li a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

nav ul li a:hover {
  text-decoration: underline;
}
</style>




<style >
/* Custom Toastr Styles */
.toast {
  background-color: #4caf50 !important; /* Green background */
  color: #ffffff !important; /* White text */
  opacity: 1 !important; /* Remove transparency */
}

.toast-success {
  background-color: #4caf50 !important; /* Green background for success */
}

.toast-error {
  background-color: #f44336 !important; /* Red background for error */
}

.toast-message {
  font-size: 16px !important; /* Increase font size */
}
</style>