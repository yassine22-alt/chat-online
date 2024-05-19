<template>
    <div>
      <input v-model="email" type="email" placeholder="Email">
      <input v-model="password" type="password" placeholder="Password">
      <button @click="handleLogin">Login</button>
    </div>
</template>
  
  <script>
    import { login } from '@/auth/auth.js';
    import { db } from '@/firebase/config';
    import { query, collection, where, getDocs } from 'firebase/firestore';

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

            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", this.email));
            const querySnapshot = await getDocs(q);

            let docId = null;
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                docId = doc.id;  
        });
          this.$router.push({ name: 'main', params: { id: docId } });
        } else {
           console.error('No user found with this email:', this.email);
           alert('No user found with this email.');
        }

        } catch (error) {
          console.error('Login error:', error);
        }
      }
    }
  }
  </script>
  