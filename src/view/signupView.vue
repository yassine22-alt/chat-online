<template>
  <div>
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

    <section class="whole" style="background-color: #808080">
      <div class="container py-5">
        <div class="d-flex justify-content-center align-items-center">
          <div class="">
            <div
              class="card shadow-2-strong p-3"
              style="border-radius: 1rem; width: 100%"
            >
              <div class="card-body p-5 text-center">
                <h3 class="mb-5 fw-bold">Sign Up</h3>
                <form @submit.prevent="handleRegister">
                  <div data-mdb-input-init class="form-outline mb-4">
                    <label class="form-label fw-bold" for="typeNameX"
                      >Name</label
                    >
                    <input
                      v-model="name"
                      type="text"
                      id="typeNameX"
                      class="form-control form-control-lg"
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div data-mdb-input-init class="form-outline mb-4">
                    <label class="form-label fw-bold" for="typeEmailX-2"
                      >Email</label
                    >
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
                  <div data-mdb-input-init class="form-outline mb-4">
                    <label
                      class="form-label fw-bold"
                      for="typeConfirmPasswordX-2"
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
                  <div data-mdb-input-init class="form-outline mb-4">
                    <label class="form-label fw-bold" for="typeBioX">Bio</label>
                    <input
                      v-model="bio"
                      type="text"
                      id="typeBioX"
                      class="form-control form-control-lg"
                      placeholder="Bio"
                    />
                  </div>
                  <div data-mdb-input-init class="form-outline mb-4">
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
                  <div data-mdb-input-init class="form-outline mb-4">
                    <label class="form-label fw-bold" for="typePhotoX"
                      >Photo URL</label
                    >
                    <input
                      v-model="photo"
                      type="url"
                      id="typePhotoX"
                      class="form-control form-control-lg"
                      placeholder="Photo URL"
                    />
                  </div>
                  <button
                    data-mdb-button-init
                    data-mdb-ripple-init
                    class="btn btn-secondary btn-lg btn-block fw-bold mb-4"
                    type="submit"
                  >
                    Register
                  </button>
                </form>
                <hr class="my-4" />
                <button
                  @click="googleSignIn"
                  data-mdb-button-init
                  data-mdb-ripple-init
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
      </div>
    </section>
  </div>
</template>

<script>
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { register } from '@/auth/auth.js';
import { db } from '@/firebase/config.js';
import { doc, setDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      bio: '',
      birth_date: '',
      photo: ''
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        const user = await register(this.email, this.password);
        if (user) {
          await setDoc(doc(db, "users", user.uid), {
            name: this.name,
            email: this.email,
            photo: this.photo,
            bio: this.bio,
            birth_date: this.birth_date,
            state: true
          });
          this.$router.push({ name: 'main', params: { id: user.uid } });
        } else {
          console.error('Registration failed: User is undefined');
        }
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          alert('The email address is already in use by another account.');
        } else {
          console.error('Registration error:', error);
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
          photo: user.photoURL,
          bio: '',
          birth_date: '',
          state: true
        });
        this.$router.push({ name: 'main', params: { id: user.uid } });
      } catch (error) {
        console.error("Google sign-in error:", error);
      }
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Reddit+Mono:wght@200..900&display=swap");
.whole {
  font-family: "Reddit Mono", monospace;
}
.container {
  max-width: 600px;
}
</style>
