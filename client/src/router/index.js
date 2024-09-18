import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/SiteHome.vue';
import UserLogin from '../components/UserLogin.vue';
import UserRegister from '../components/UserRegister.vue';
import Admin from '@/components/AdminHome.vue';
import ProjectsHome from '../components/ProjectsHome.vue';
import ExperienceHome from '../components/ExperienceHome.vue';
import LogoutUser from '../components/LogoutUser.vue'; // Import the Logout component

import AuthService from '../services/AuthService';



const routes = [
  {
    path: '/',
    name: 'SiteHome',
    component: Home
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegister
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/projects',
    name: 'ProjectsHome',
    component: ProjectsHome
  },
  {
    path: '/experience',
    name: 'ExperienceHome',
    component: ExperienceHome
  },
  {
    path: '/logout',
    name: 'LogoutUser',
    component: LogoutUser
  },
  {
    path: '/admin',
    component: Admin,
    name: 'Admin',

    beforeEnter: (to, from, next) => {
      if (AuthService.isAuthenticated()) {
        next();
      } else {
        next('/login');
      }
    }
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
