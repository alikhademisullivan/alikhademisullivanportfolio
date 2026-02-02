<template>
    <div></div>
  </template>
  
  <script>
  import AuthService from '../services/AuthService';
  
  export default {
    name: 'LogoutUser',
    created() {
      AuthService.logout();
      this.$emit('login-success');
      this.$router.push({ name: 'SiteHome' });
    }
  }
  </script>