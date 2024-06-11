<template>
  <div class="main-container">
    <Navbar />
    <div class="container mt-5 mb-2 pt-5 d-flex justify-content-center">
      <div class="card-body  chatroom-card">
        <h2 class="text-center-lg mb-4">Create a New Chatroom</h2>
        <form @submit.prevent="createChatroom">
          <div class="mb-3 text-center">
            <label for="chatroom-name" class="form-label">Chatroom Name</label>
            <input
              type="text"
              class="form-control"
              id="chatroom-name"
              v-model="chatroomName"
              required
            />
          </div>

          <div class="mb-3 text-center">
            <label class="form-label">Chatroom Type</label><p></p>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="chatroomType"
                id="publicChatroom"
                :value="true"
                v-model="chatroomType"
              />
              <label class="form-check-label" for="publicChatroom">Public</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="chatroomType"
                id="privateChatroom"
                :value="false"
                v-model="chatroomType"
              />
              <label class="form-check-label" for="privateChatroom">Private</label>
            </div>
          </div>

          <div class="d-flex justify-content-between flex-wrap">
            <div class="users-box p-3 flex-fill">
              <label class="form-label">Select Users</label>
              <div v-for="user in users" :key="user.id" class="form-check user-checkbox">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="user.id"
                  v-model="selectedUsers"
                  :id="`user-${user.id}`"
                />
                <label class="form-check-label d-flex align-items-center" :for="`user-${user.id}`">
                  <img
                    :src="user.photo || require('@/assets/avatars/default-avatar.jpeg')"
                    class="img-thumbnail user-thumbnail"
                  />
                  {{ user.name }}
                </label>
              </div>
            </div>

            <div class="avatars-box p-3 flex-fill">
              <label class="form-label">Select Chatroom Picture</label>
              <div class="d-flex justify-content-center flex-wrap mt-3">
                <img
                  v-for="avatar in avatars"
                  :key="avatar"
                  :src="avatar"
                  class="img-fluid avatar-option"
                  @click="selectAvatar(avatar)"
                  :class="{ selected: selectedAvatar === avatar }"
                  style="width: 50px; cursor: pointer; margin: 5px; border-radius: 50%;"
                />
              </div>
              <div class="text-center mt-3">
                <img
                  v-if="selectedAvatar"
                  :src="selectedAvatar"
                  class="img-fluid"
                  style="width: 150px; border-radius: 50%;"
                />
              </div>
            </div>
          </div>

          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary w-50 py-2">
              Create Chatroom
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/config.js";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import Navbar from "@/components/NavBar.vue";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      users: [],
      chatroomName: "",
      chatroomType: true,
      selectedUsers: [],
      selectedAvatar: "",
      currentUser: this.$route.params.idUser,
      avatars: [
        require('@/assets/pdp/pdp1.jpeg'),
        require('@/assets/pdp/pdp2.jpeg'),
        require('@/assets/pdp/pdp3.jpeg'),
        require('@/assets/pdp/pdp4.jpeg'),
        require('@/assets/pdp/pdp5.jpeg'),
        require('@/assets/pdp/pdp6.jpeg'),
      ],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          let user = doc.data();
          user.id = doc.id;
          if (user.id !== this.currentUser) {
            this.users.push(user);
          }
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
    },
    async createChatroom() {
      if (this.chatroomName && this.selectedUsers.length > 1 && this.selectedAvatar) {
        const involvedUsers = [this.currentUser, ...this.selectedUsers];
        const existingChatsQuery = query(
          collection(db, "chatrooms"),
          where("involved_users", "array-contains-any", involvedUsers)
        );
        const existingChatsSnapshot = await getDocs(existingChatsQuery);

        let existingChat = null;
        existingChatsSnapshot.forEach((doc) => {
          const chat = doc.data();
          if (
            involvedUsers.every((user) => chat.involved_users.includes(user)) &&
            chat.involved_users.length === involvedUsers.length
          ) {
            existingChat = chat;
          }
        });

        if (existingChat) {
          alert(
            `Chatroom with the same members already exists: ${existingChat.chat_name}`
          );
          return;
        }

        try {
          const chatData = {
            chat_name: this.chatroomName,
            chat_type: this.chatroomType, // Include chatroom type as boolean
            involved_users: involvedUsers,
            messages: [],
            typing_status: [],
            photo: this.selectedAvatar,
          };
          const chat = await addDoc(collection(db, "chatrooms"), chatData);

          for (const userId of involvedUsers) {
            const userDocRef = doc(db, "users", userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userConversations = userDoc.data().conversations || [];
              if (userConversations.length > 0) {
                await updateDoc(userDocRef, {
                  conversations: arrayUnion(chat.id),
                });
              } else {
                await updateDoc(userDocRef, {
                  conversations: [chat.id],
                });
              }
            } else {
              console.error(`User document not found for userId: ${userId}`);
            }
          }

          console.log("Chat created successfully");
          this.$router.push(`/chat/${this.currentUser}/${chat.id}`);
        } catch (error) {
          console.error("Failed to create chat:", error);
        }
      } else {
        alert("Please enter a chatroom name, select at least two users, and choose a chatroom pic.");
      }
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Reddit+Mono:wght@200..900&display=swap');

.main-container {
  background: white;
  min-height: 100vh;
  font-family: 'Reddit Mono', monospace;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container{
  width: 900px;
  padding: 50px;
  
}
.card-body {
  
  width: 60%;
}

.form-label {
  font-weight: bold;
  color: #333;
}

.form-control {
  font-size: 1rem;
  border-radius: 0.5rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.avatar-option {
  transition: transform 0.3s ease;
}

.avatar-option:hover {
  transform: scale(1.2);
}

.avatar-option.selected {
  border: 3px solid blue;
}

.user-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-checkbox input {
  margin-right: 10px;
}

.users-box {
  max-height: 300px;
  overflow-y: auto;
  border-right: 1px solid #ddd;
}

.avatars-box {
  text-align: center;
}

.avatars-box img {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatars-box img:hover {
  transform: scale(1.1);
}

.avatars-box img.selected {
  border: 3px solid #007bff;
}

.avatars-box .selected-avatar {
  margin-top: 1rem;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid #007bff;
}

.text-center-lg{
  color: black;
  font-weight: bolder;
}
</style>
