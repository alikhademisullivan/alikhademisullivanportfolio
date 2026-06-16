import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import UserLogin from '../components/UserLogin.vue';
import UserRegister from '../components/UserRegister.vue';
import Admin from '../components/AdminHome.vue';
import Projects from '../components/Projects.vue';
import Experience from '../components/Experience.vue';
import Contact from '../components/Contact.vue';
import LogoutUser from '../components/LogoutUser.vue';
import SkillsHome from '../components/SkillsHome.vue';
import AuthService from '../services/AuthService';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/register', name: 'UserRegister', component: UserRegister },
  { path: '/login', name: 'UserLogin', component: UserLogin },
  { path: '/projects', name: 'Projects', component: Projects },
  { path: '/experience', name: 'Experience', component: Experience },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/logout', name: 'LogoutUser', component: LogoutUser },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      AuthService.isAdmin() ? next() : next('/login');
    }
  },
  {
    path: '/skills',
    name: 'SkillsHome',
    component: SkillsHome,
    beforeEnter: (to, from, next) => {
      AuthService.isAdmin() ? next() : next('/login');
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
