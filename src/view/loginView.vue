<template>
  <div>
    <nav class="navbar fixed-top navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img src="@/assets/MyChatBox_transparent.png" alt="MyChatBox Logo" width="200" class="d-inline-block align-top">
        </a>
        <div class="d-flex ms-auto">
          <router-link to="/signup" class="btn btn-outline-dark me-2">Sign Up</router-link>
          <router-link to="/login" class="btn btn-outline-dark">Login</router-link>
        </div>
      </div>
    </nav>

    <section class="whole vh-100" style="background-color: #808080">
      <div class="container py-5 ">
        <div class=" d-flex justify-content-center align-items-center ">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5 align-items-center">
            <div class="card shadow-2-strong p-3" style="border-radius: 1rem; width: 100%;">
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
  </div>
</template>

<script>
import { login } from "@/auth/auth.js";

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
        this.$router.push({ name: "main", params: { id: user.uid } });
      } catch (error) {
        console.error("Login error:", error);
      }
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Reddit+Mono:wght@200..900&display=swap');

.whole {
  font-family: "Reddit Mono", monospace;
}
</style>
