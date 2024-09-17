import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import AuthService from './services/AuthService';
const app = createApp(App);

window.addEventListener('beforeunload', () => {
  AuthService.logout();
});

app.use(router);
app.mount('#app');


