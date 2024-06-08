<template>
  <div>
    <Navbar />
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
import Navbar from "@/components/NavBar.vue";
export default {
  components: {
    Navbar,
  },
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
