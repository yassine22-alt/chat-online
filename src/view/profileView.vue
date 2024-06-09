<template>
  <div>
    <Navbar />

    <section class="vh-100" style="background-color: lightgrey">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-10 col-lg-8">
            <div class="card mb-3" style="border-radius: 0.5rem; width: 100%">
              <div class="row g-0">
                <div
                  class="col-md-4 gradient-custom text-center text-white d-flex flex-column align-items-center justify-content-center"
                  style="
                    border-top-left-radius: 0.5rem;
                    border-bottom-left-radius: 0.5rem;
                    background-color: black;
                  "
                >
                  <img
                    :src="
                      currentUser.photo ||
                      'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp'
                    "
                    alt="Avatar"
                    class="img-fluid my-3"
                    style="width: 100px; border-radius: 50%"
                  />
                  <div v-if="currentUser">
                    <h5>{{ currentUser.name }}</h5>
                    <p>{{ currentUser.email }}</p>
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="card-body p-4">
                    <h5>About Me</h5>
                    <hr class="mt-0 mb-4" />
                    <div v-if="currentUser && currentUser.bio">
                      <p>{{ currentUser.bio }}</p>
                    </div>
                    <div v-else>
                      <p>Press edit to enter your bio</p>
                    </div>
                    <h6>Birthdate</h6>
                    <hr class="mt-0 mb-4" />
                    <div v-if="currentUser && currentUser.birth_date">
                      <p>{{ currentUser.birth_date }}</p>
                    </div>
                    <div v-else>
                      <p>Press edit to enter your birthdate</p>
                    </div>
                  </div>
                  <div class="card-footer d-flex justify-content-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      class="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                      data-bs-toggle="modal"
                      data-bs-target="#editProfile"
                      style="cursor: pointer"
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

    <!-- Edit Profile Modal -->
    <div
      class="modal fade"
      id="editProfile"
      tabindex="-1"
      aria-labelledby="editProfileLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editProfileLabel">Edit Profile</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateProfile">
              <div class="mb-3 text-center">
                <img
                  :src="
                    currentUser.photo ||
                    'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp'
                  "
                  alt="Avatar"
                  class="img-fluid mb-3"
                  style="width: 100px; border-radius: 50%"
                />
                <div class="d-flex justify-content-center flex-wrap">
                  <img
                    v-for="avatar in avatars"
                    :key="avatar"
                    :src="avatar"
                    class="img-fluid avatar-option"
                    @click="selectAvatar(avatar)"
                    style="
                      width: 50px;
                      cursor: pointer;
                      margin: 5px;
                      border-radius: 50%;
                    "
                  />
                </div>
              </div>
              <div class="mb-3">
                <label for="editName" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="editName"
                  v-model="currentUser.name"
                />
              </div>
              <div class="mb-3">
                <label for="editBio" class="form-label">Bio</label>
                <input
                  type="text"
                  class="form-control"
                  id="editBio"
                  v-model="currentUser.bio"
                />
              </div>
              <div class="mb-3">
                <label for="editBirthDate" class="form-label">Birth Date</label>
                <input
                  type="date"
                  class="form-control"
                  id="editBirthDate"
                  v-model="currentUser.birth_date"
                />
              </div>
              <button type="submit" class="btn btn-secondary">
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/config.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Navbar from "@/components/NavBar.vue";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      userId: this.$route.params.id,
      currentUser: {
        name: "",
        bio: "",
        birth_date: "",
        photo: "",
        email: "",
      },
    };
  },
  methods: {
    async fetchUser() {
      try {
        const userDoc = await getDoc(doc(db, "users", this.userId));
        if (userDoc.exists()) {
          this.currentUser = userDoc.data();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    async updateProfile() {
      try {
        if (this.currentUser) {
          await setDoc(doc(db, "users", this.userId), this.currentUser);
          alert("Profile updated successfully!");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
  },
  created() {
    this.fetchUser();
  },
};
</script>

<style>
.gradient-custom {
  background: linear-gradient(45deg, #6a3939 0%, #000000 100%);
}
</style>
