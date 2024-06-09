<template>
    <div>
      <Navbar />
  
      <div class="container mt-5 pt-5">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="createChatroom">
              <div class="mb-3">
                <label for="chatroom-name" class="form-label">Chatroom Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="chatroom-name"
                  v-model="chatroomName"
                  required
                />
              </div>
  
              <div class="mb-3">
                <label class="form-label">Select Users</label>
                <div v-for="user in users" :key="user.id" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="user.id"
                    v-model="selectedUsers"
                    :id="`user-${user.id}`"
                  />
                  <label class="form-check-label" :for="`user-${user.id}`">
                    {{ user.name }}
                  </label>
                </div>
              </div>
  
              <button type="submit" class="btn btn-primary">Create Chatroom</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from "@/firebase/config.js";
  import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
  import Navbar from "@/components/NavBar.vue";
  
  export default {
    components: {
      Navbar,
    },
    data() {
      return {
        users: [],
        chatroomName: "",
        selectedUsers: [],
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
            if (user.id !== this.$route.params.id) {
              this.users.push(user);
            }
          });
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
      async createChatroom() {
        if (this.chatroomName && this.selectedUsers.length > 1) {
          try {
            // Check for existing chatroom
            const involvedUsers = [this.$route.params.id, ...this.selectedUsers];
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
              alert(`Chatroom with the same members already exists: ${existingChat.chat_name}`);
              return;
            }
  
            // Create new chatroom
            const chatData = {
              chat_name: this.chatroomName,
              involved_users: involvedUsers,
              messages: [],
              typing_status: [],
            };
            const chat = await addDoc(collection(db, "chatrooms"), chatData);
            console.log("Chat created successfully");
            this.$router.push(`/chat/${this.$route.params.id}/${chat.id}`);
          } catch (error) {
            console.error("Failed to create chat:", error);
          }
        } else {
          alert("Please enter a chatroom name and select at least two users.");
        }
      },
    },
  };
  </script>
  
  
  <style>
  .container {
    max-width: 600px;
  }
  .pt-5 {
    padding-top: 3rem !important;
  }
  </style>
  