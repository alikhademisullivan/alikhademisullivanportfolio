<template>
    <div></div>
  </template>
  
  <script>
  import AuthService from '../services/AuthService';
  
  export default {
    name: 'LogoutUser',
    created() {
      AuthService.logout();
      this.$router.push({ name: 'UserLogin' });
    }
  }
  </script>