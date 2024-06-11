<template>
  <div class="home">
    <nav class="navbar fixed-top navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img
            src="@/assets/MyChatBox_transparent.png"
            alt="MyChatBox Logo"
            width="200"
            class="d-inline-block align-top"
          />
        </a>
        <div class="d-flex ms-auto">
          <router-link to="/signup" class="btn btn-outline-dark me-2">Sign Up</router-link>
          <router-link to="/login" class="btn btn-outline-dark">Login</router-link>
        </div>
      </div>
    </nav>

    <div class="welcome-message">
      <h1>Login to MyChatBox</h1>
      <div class="form-container">
        <div class="card shadow-2-strong p-3 text-center" style="border-radius: 1rem; width: 90%;">
          
            <form @submit.prevent="handleLogin">
              <div data-mdb-input-init class="form-outline mb-4">
                <label class="form-label fw-bold" for="typeEmailX-2">Email</label>
                <input
                  v-model="email"
                  type="email"
                  id="typeEmailX-2"
                  class="form-control form-control-lg"
                  placeholder="Email"
                  required
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
                  required
                />
              </div>
              <button data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-lg btn-block fw-bold" type="submit">
                Login
              </button>
            </form>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/auth/auth.js";
import { db } from '@/firebase/config.js'
import { doc, updateDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const user = await login(this.email, this.password);
        console.log("Logged in user:", user);
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          state: true,
        });
        this.$router.push({ name: "main", params: { idUser: user.uid } });
      } catch (error) {
        console.error("Login error:", error);
        alert("The email address doesnt exist.");
      }
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Reddit+Mono:wght@200..900&display=swap');

body, html {
  margin: 0;
  padding: 0;
}

.home {
  font-family: "Reddit Mono", monospace;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom, #ffffff, #d0e7ff);
  padding-bottom: 50px;
}

.welcome-message {
  text-align: center;
  padding-top: 50px;
  z-index: 5;
  position: relative;
}

.welcome-message h1 {
  font-size: 50px;
  margin-bottom: 20px;
  color: black;
  font-weight: bold;
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 0 15px; /* Add padding on the sides */
}

.card {
  width: 80%; 
  max-width: 600px; 
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
