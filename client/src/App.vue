<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <img src="@/assets/logoalikhademisullivan.png" alt="AKS logo" class="profile-image" />
        <span class="nav-name">Ali Khademi Sullivan</span>
      </div>

      <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>

      <div class="nav-links" :class="{ open: menuOpen }">
        <router-link class="nav-link" to="/" @click="menuOpen = false">Home</router-link>
        <router-link class="nav-link" to="/projects" @click="menuOpen = false">Projects</router-link>
        <router-link class="nav-link" to="/experience" @click="menuOpen = false">Experience</router-link>
        <router-link class="nav-link" to="/contact" @click="menuOpen = false">Contact</router-link>
        <router-link v-if="isAdmin" class="nav-link" to="/admin" @click="menuOpen = false">Admin</router-link>
        <router-link v-if="isAuthenticated" class="nav-link" to="/logout" @click="menuOpen = false">Logout</router-link>
      </div>
    </nav>

    <router-view @login-success="updateAuthStatus"/>

    <footer>
      <p>© {{ currentYear }} Ali Khademi Sullivan. All rights reserved.</p>
      <nav>
        <ul>
          <li><a href="https://www.linkedin.com/in/ali-khademi-sullivan-49930b24a/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a></li>
          <li><a href="https://github.com/alikhademisullivan" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a></li>
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
      isAdmin: AuthService.isAdmin(),
      menuOpen: false
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
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
.profile-image {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.8);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.nav-name {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 14px 30px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 15px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-link.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.25);
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s;
}

footer {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  padding: 30px 0;
  text-align: center;
}

footer p {
  margin: 8px 0;
  font-size: 14px;
  opacity: 0.8;
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
  font-size: 22px;
  transition: all 0.3s ease;
  opacity: 0.7;
}

nav ul li a:hover {
  opacity: 1;
  transform: scale(1.15);
  display: inline-block;
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-name {
    display: none;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    flex-direction: column;
    padding: 16px;
    gap: 4px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    padding: 12px 16px;
  }
}
</style>

<style>
.toast {
  background-color: #10b981 !important;
  color: #ffffff !important;
  opacity: 1 !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
}
.toast-success { background-color: #10b981 !important; }
.toast-error { background-color: #ef4444 !important; }
.toast-message { font-size: 15px !important; font-weight: 500 !important; }
</style>
