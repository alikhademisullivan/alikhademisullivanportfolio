import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import AuthService from './services/AuthService';

import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import 'bootstrap/dist/css/bootstrap.css';

const app = createApp(App);

window.addEventListener('beforeunload', () => {
  AuthService.logout();
});

app.use(router);
app.mount('#app');


