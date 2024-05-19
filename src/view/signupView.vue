<template>
    <div>
      <h1>Register</h1>
      <input v-model="email" type="email" placeholder="Email">
      <input v-model="password" type="password" placeholder="Password">
      <button @click="handleRegister">Register</button>
      <button @click="googleSignIn">Register with Google</button>
    </div>
  </template>
  
  <script>
  import { register } from '@/auth/auth.js';
  import { auth } from '@/firebase/config.js'  
  
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async handleRegister() {
        try {
          await register(this.email, this.password);
          this.$router.push('/');
        } catch (error) {
          console.error('Registration error:', error);
        }
      },
      async googleSignIn() {
        const provider = new auth.GoogleAuthProvider();
        try {
          await auth.signInWithPopup(provider);
          this.$router.push('/');
        } catch (error) {
          console.error('Google sign-in error:', error);
        }
      }
    }
  }
  </script>