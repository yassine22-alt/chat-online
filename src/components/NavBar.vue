<template>
  <nav class="navbar fixed-top navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" @click="backto_mainpage">
        <img
          src="@/assets/MyChatBox_transparent.png"
          alt="MyChatBox Logo"
          width="200"
          class="d-inline-block align-top"
        />
      </a>
      <div class="d-flex ms-auto align-items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="29"
          height="29"
          fill="black"
          class="bi bi-envelope-plus-fill popover-icon ms-5"
          viewBox="0 0 16 16"
          @click="goto_newusers"
        >
          <path
            d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 4.697v4.974A4.5 4.5 0 0 0 12.5 8a4.5 4.5 0 0 0-1.965.45l-.338-.207z"
          />
          <path
            d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="29"
          height="29"
          fill="black"
          class="bi bi-people-fill popover-icon ms-5"
          viewBox="0 0 16 16"
          @click="goto_newgroup"
        >
          <path
            d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="29"
          height="29"
          fill="black"
          class="bi bi-person-circle popover-icon ms-5"
          viewBox="0 0 16 16"
          @click="goto_profile"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            fill-rule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="29"
          height="29"
          fill="black"
          class="bi bi-bell-fill ms-5"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"
          />
        </svg>

        <router-link to="/" class="btn btn-outline-dark ms-5" @click.prevent="handleLogout">Logout</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { db } from '@/firebase/config.js'
import { doc, updateDoc } from 'firebase/firestore'
import { logout } from '@/auth/auth.js'
export default {
  methods: {
    goto_newusers() {
      const userId = this.$route.params.idUser;
      this.$router.push(`/newusers/${userId}`);
    },
    goto_profile() {
      const userId = this.$route.params.idUser;
      this.$router.push(`/profile/${userId}`);
    },
    backto_mainpage() {
      const userId = this.$route.params.idUser;
      this.$router.push(`/main/${userId}`);
    },
    goto_newgroup() {
      const userId = this.$route.params.idUser;
      this.$router.push(`/newchat/${userId}`);
    },
    async handleLogout() {
      const userId = this.$route.params.idUser;
      try {
        await logout();
        console.log('user logged out')
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          state: false,
        });
        this.$route.push('/');
      } catch (error) {
        console.log('Logout failed')
      }
    }
  },
  computed: {
    userId() {
      return this.$route.params.id;
    },
  },
};
</script>

<style>
.navbar .popover-icon {
  cursor: pointer;
}
</style>
