import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/SiteHome_new.vue';
import UserLogin from '../components/UserLogin.vue';
import UserRegister from '../components/UserRegister.vue';
import Admin from '@/components/AdminHome.vue';
import ProjectsHome from '../components/ProjectsHome_new.vue';
import ExperienceHome from '../components/ExperienceHome_new.vue';
import Contact from '../components/Contact_new.vue';
import LogoutUser from '../components/LogoutUser.vue';
import SkillsHome from '../components/SkillsHome.vue';

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
    path: '/contact',
    name: 'Contact',
    component: Contact
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
      if (AuthService.isAdmin()) {
        next();
      } else {
        next('/login');
      }
    }
  },
  {
    path: '/skills',
    name: 'SkillsHome',
    component: SkillsHome,
    beforeEnter: (to, from, next) => {
      if (AuthService.isAdmin()) {
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
