<template>
  <div>
    <Navbar />

    <section class="vh-100 main-container py-5 h-100 d-flex flex-column align-items-center mb-5">
      
        <h1 class="welcome-text">Welcome {{ currentUser.name }} to your profile!</h1>
        <div class="profile-section d-flex align-items-start mr-5 pr-5">
          <div class="profile-picture-section text-center">
            <img
              :src="currentUser.photo || require('@/assets/avatars/default-avatar.jpeg')"
              alt="Avatar"
              class="img-fluid profile-pic"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              class="bi bi-pencil-square edit-icon"
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
          <div class="profile-container card-body p-4">
            
              <div class="info-box">
                <h6>Name:</h6>
                <p>{{ currentUser.name }}</p>
              </div>
              <div class="info-box">
                <h6>Email:</h6>
                <p>{{ currentUser.email }}</p>
              </div>
              <div class="info-box bio-box">
                <h6>Bio:</h6>
                <div v-if="currentUser && currentUser.bio">
                  <p>{{ currentUser.bio }}</p>
                </div>
                <div v-else>
                  <p>Press edit to enter your bio</p>
                </div>
              </div>
              <div class="info-box birthdate-box">
                <h6>Birthdate:</h6>
                <div v-if="currentUser && currentUser.birth_date">
                  <p>{{ currentUser.birth_date }}</p>
                </div>
                <div v-else>
                  <p>Press edit to enter your birthdate</p>
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
                   :src="currentUser.photo || require('@/assets/avatars/default-avatar.jpeg')"
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
      userId: this.$route.params.idUser,
      currentUser: {
        name: "",
        bio: "",
        birth_date: "",
        photo: "",
        email: "",
      },
      avatars: [
        require("@/assets/avatars/avatar1.jpeg"),
        require("@/assets/avatars/avatar2.jpeg"),
        require("@/assets/avatars/avatar3.jpeg"),
        require("@/assets/avatars/avatar4.jpeg"),
        require("@/assets/avatars/avatar5.jpeg"),
        require("@/assets/avatars/avatar6.jpeg"),
      ],
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
          // eslint-disable-next-line no-undef
          const modal = bootstrap.Modal.getInstance(
            document.getElementById("editProfile")
          );
          modal.hide();
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    selectAvatar(avatar) {
      this.currentUser.photo = avatar;
    },
  },
  created() {
    this.fetchUser();
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Reddit+Mono:wght@200..900&display=swap');

body {
  background-color: #f5f7fa;
  font-family: 'Reddit Mono', monospace;
}

.main-container {
  background: linear-gradient(to right, #e0eafc, #cfdef3);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 60px;
}

.welcome-text {
  font-size: 2.5rem;
  color: #1d2b64;
  margin-bottom: 2rem;
}

.profile-section {
  display: flex;
  width: 50%;
  background-color:#1d2b64;
  padding: 20px;
  border-radius: 50px;
}

.profile-picture-section {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-pic {
  width: 100%;
  height: auto;
  border-radius: 50%;
  border: 3px solid #1d2b64;
}

.edit-icon {
  margin-top: 20px;
}

.profile-container {
  width: 90%;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-left: 20px;
}

.info-box {
  margin-bottom: 1rem;
}

.bio-box {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 0.5rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.birthdate-box {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 0.5rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>