<template>
  <div>
    <nav class="navbar fixed-top navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand">
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

    <section class="vh-100" style="background-color: lightgrey">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col col-lg-6 mb-4 mb-lg-0">
            <div class="card mb-3" style="border-radius: 0.5rem">
              <div class="row g-0">
                <div
                  class="col-md-4 gradient-custom text-center text-white"
                  style="
                    border-top-left-radius: 0.5rem;
                    border-bottom-left-radius: 0.5rem;
                    background-color: black;
                  "
                >
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="Avatar"
                    class="img-fluid my-5"
                    style="width: 80px"
                  />
                  <div v-if="currentUser">
                    <h5>{{ currentUser.name }}</h5>
                    <p>{{ currentUser.email }}</p>
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="card-body p-4">
                    <h6>Bio</h6>
                    <hr class="mt-0 mb-4" />
                    <div v-if="currentUser && currentUser.bio">
                      <p>{{ currentUser.bio }}</p>
                    </div>
                    <div v-else>
                      <p>Press edit to enter your bio</p>
                    </div>
                    <h6>Birthdate</h6>
                    <hr class="mt-0 mb-4" />
                    <div v-if="currentUser && currentUser.birthdate">
                      <p>{{ currentUser.birthdate }}</p>
                    </div>
                    <div v-else>
                      <p>Press edit to enter your birthdate</p>
                    </div>
                  </div>
                  <div class="card-footer d-flex justify-content-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                      data-bs-toggle="modal"
                      data-bs-target="#editProfile"
                    >
                      <path
                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <div
      class="modal fade"
      id="editProfile"
      tabindex="-1"
      aria-labelledby="editProfile"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editProfile">Modal title</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { db } from "@/firebase/config.js";
import { collection, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      users: [],
      userId: this.$route.params.id,
      currentUser: null,
    };
  },

  methods: {
    async fetchUsersAndCurrentUser() {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          let user = doc.data();
          user.id = doc.id;
          this.users.push(user);
          if (user.id === this.userId) {
            this.currentUser = user;
          }
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    goto_newusers() {
      this.$router.push(`/newusers/${this.userId}`);
    },
    goto_profile() {
      this.$router.push(`/profile/${this.userId}`);
    },
    backto_mainpage() {
      this.$router.push(`/main/${this.userId}`);
    },
  },
  created() {
    this.fetchUsersAndCurrentUser();
  },
};
</script>
