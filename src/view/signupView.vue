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
          <router-link to="/signup" class="btn btn-outline-dark me-2"
            >Sign Up</router-link
          >
          <router-link to="/login" class="btn btn-outline-dark"
            >Login</router-link
          >
        </div>
      </div>
    </nav>

    <div class="welcome-message">
      <h1>Sign Up to MyChatBox</h1>
      <div class="form-container">
        <div
          class="card text-center shadow-2-strong p-3"
          
        >
          <form @submit.prevent="handleRegister">
            <div class="form-outline mb-4">
              <label class="form-label fw-bold" for="typeNameX">Name</label>
              <input
                v-model="name"
                type="text"
                id="typeNameX"
                class="form-control form-control-lg"
                placeholder="Name"
                required
              />
            </div>
            <div class="form-outline mb-4">
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
            <div class="form-outline mb-4">
              <label class="form-label fw-bold" for="typePasswordX-2"
                >Password</label
              >
              <input
                v-model="password"
                type="password"
                id="typePasswordX-2"
                class="form-control form-control-lg"
                placeholder="Password"
                required
              />
            </div>
            <div class="form-outline mb-4">
              <label class="form-label fw-bold" for="typeConfirmPasswordX-2"
                >Confirm Password</label
              >
              <input
                v-model="confirmPassword"
                type="password"
                id="typeConfirmPasswordX-2"
                class="form-control form-control-lg"
                placeholder="Confirm Password"
                required
              />
            </div>
            <div class="form-outline mb-4">
              <label class="form-label fw-bold" for="typeBioX">Bio</label>
              <input
                v-model="bio"
                type="text"
                id="typeBioX"
                class="form-control form-control-lg"
                placeholder="Bio"
              />
            </div>
            <div class="form-outline mb-4">
              <label class="form-label fw-bold" for="typeBirthDateX"
                >Birth Date</label
              >
              <input
                v-model="birth_date"
                type="date"
                id="typeBirthDateX"
                class="form-control form-control-lg"
              />
            </div>
            <button
              class="btn btn-primary btn-lg btn-block fw-bold mb-4"
              type="submit"
            >
              Register
            </button>
          </form>
          <hr class="my-4" />
          <button
            @click="googleSignIn"
            class="btn btn-lg btn-block btn-primary fw-bold"
            style="background-color: #dd4b39"
            type="button"
          >
            <i class="fab fa-google me-2"></i>Register with Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { register } from "@/auth/auth.js";
import { db } from "@/firebase/config.js";
import { doc, setDoc } from "firebase/firestore";

export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      bio: "",
      birth_date: "",
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      try {
        const user = await register(this.email, this.password);
        if (user) {
          await setDoc(doc(db, "users", user.uid), {
            name: this.name,
            email: this.email,
            bio: this.bio,
            birth_date: this.birth_date,
            state: true,
          });
          this.$router.push({ name: "main", params: { idUser: user.uid } });
        } else {
          console.error("Registration failed: User is undefined");
        }
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          alert("The email address is already in use by another account.");
        } else {
          console.error("Registration error:", error);
        }
      }
    },
    async googleSignIn() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          bio: "",
          birth_date: "",
          state: true,
        });
        this.$router.push({ name: "main", params: { idUser: user.uid } });
      } catch (error) {
        console.error("Google sign-in error:", error);
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Reddit+Mono:wght@200..900&display=swap");

body,
html {
  margin: 0;
  padding: 0;
}

.home {
  font-family: "Reddit Mono", monospace;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom, #ffffff, #a9c9ec);
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
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.card {
  padding: 50px;
  border-radius: 1rem; 
  width: 100%;
}
</style>
