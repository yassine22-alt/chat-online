<template>
    <div>
      <input v-model="email" type="email" placeholder="Email">
      <input v-model="password" type="password" placeholder="Password">
      <button @click="handleLogin">Login</button>
    </div>
</template>
  
  <script>
  import { login } from '@/auth/auth.js';
  
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async handleLogin() {
        try {
          const user = await login(this.email, this.password);
          console.log('Logged in user:', user);
        } catch (error) {
          console.error('Login error:', error);
        }
      }
    }
  }
  </script>
  