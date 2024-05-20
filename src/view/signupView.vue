<template>
  <section class="vh-100" style="background-color: #808080">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card shadow-2-strong" style="border-radius: 1rem">
            <div class="card-body p-5 text-center">
              <h3 class="mb-5 fw-bold">Sign Up</h3>
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
                @click="handleRegister"
                data-mdb-button-init
                data-mdb-ripple-init
                class="btn btn-secondary btn-lg btn-block fw-bold"
                type="submit"
              >
                Register
              </button>
              <hr class="my-4" />
              <button
                @click="googleSignIn"
                data-mdb-button-init
                data-mdb-ripple-init
                class="btn btn-lg btn-block btn-primary fw-bold"
                style="background-color: #dd4b39"
                type="submit"
              >
                <i class="fab fa-google me-2"></i>Register with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { register } from "@/auth/auth.js";
import { auth } from "@/firebase/config.js";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleRegister() {
      try {
        await register(this.email, this.password);
        this.$router.push("/");
      } catch (error) {
        console.error("Registration error:", error);
      }
    },
    async googleSignIn() {
      const provider = new auth.GoogleAuthProvider();
      try {
        await auth.signInWithPopup(provider);
        this.$router.push("/");
      } catch (error) {
        console.error("Google sign-in error:", error);
      }
    },
  },
};
</script>
