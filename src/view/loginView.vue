<template>
  <section class="vh-100" style="background-color: #808080">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card shadow-2-strong" style="border-radius: 1rem">
            <div class="card-body p-5 text-center">
              <h3 class="mb-5 fw-bold">Login</h3>
              <div data-mdb-input-init class="form-outline mb-4">
                <label class="form-label fw-bold" for="typeEmailX-2">Email</label>
                <input
                  v-model="email"
                  type="email"
                  id="typeEmailX-2"
                  class="form-control form-control-lg"
                  placeholder="Email"
                />
              </div>
              <div data-mdb-input-init class="form-outline mb-4">
                <label class="form-label fw-bold" for="typePasswordX-2">Password</label>
                <input
                  v-model="password"
                  type="password"
                  id="typePasswordX-2"
                  class="form-control form-control-lg"
                  placeholder="Password"
                />
              </div>
              <button
                @click="handleLogin"
                data-mdb-button-init
                data-mdb-ripple-init
                class="btn btn-secondary btn-lg btn-block fw-bold"
                type="submit"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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
  