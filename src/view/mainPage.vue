<template>
  <div>
    <nav class="navbar fixed-top navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" >
          <img
            src="@/assets/MyChatBox_transparent.png"
            alt="MyChatBox Logo"
            width="200"
            class="d-inline-block align-top"
            @click="backto_mainpage"
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
          <router-link to="/" class="btn btn-outline-dark ms-5"
            >Logout</router-link
          >
        </div>
      </div>
    </nav>
    <nav class="navbar navbar-light searchbar">
      <div class="container-fluid">
        <form class="d-flex mx-auto" style="width: 100%; max-width: 600px">
          <input
            class="form-control me-2 flex-grow-1"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-dark" type="submit">Search</button>
        </form>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: null,
    };
  },

  methods: {
    goto_newusers() {
      const userId = this.$route.params.id;
      this.$router.push(`/newusers/${userId}`);
    },
    goto_profile() {
      const userId = this.$route.params.id;
      this.$router.push(`/profile/${userId}`);
    },
    backto_mainpage() {
      const userId = this.$route.params.id;
      this.$router.push(`/main/${userId}`);
    },
  },
};
</script>
<style>
.searchbar {
  margin-top: 90px;
  justify-content: center;
}

.popover-icon {
  cursor: pointer;
}
</style>
