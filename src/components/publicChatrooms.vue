<template>
  <div>
    
    <div class="public-chatrooms">
      <div v-for="chat in publicChatrooms" :key="chat.id" class="chatroom-card">
        <div class="chatroom-info">
          <img :src="chat.photo || require('@/assets/avatars/default-avatar.jpeg')" alt="Chat Avatar" class="chat-avatar" />
          <div class="chatroom-details">
            <h3>{{ chat.chat_name }}</h3>
            <p>{{ chat.description }}</p>
          </div>
        </div>
        <button class="btn btn-primary" @click="joinChatroom(chat.id)">Join</button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/config.js";
import { collection, doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";

export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      publicChatrooms: [],
    };
  },
  async created() {
    this.setupPublicChatroomsListener();
  },
  methods: {
    setupPublicChatroomsListener() {
      const chatroomsRef = collection(db, "chatrooms");

      onSnapshot(chatroomsRef, (querySnapshot) => {
        const publicChatrooms = [];
        querySnapshot.forEach((doc) => {
          const chatData = doc.data();
          if (chatData.chat_type == true && !chatData.involved_users.includes(this.userId)) {
            publicChatrooms.push({
              id: doc.id,
              ...chatData,
            });
          }
        });
        this.publicChatrooms = publicChatrooms;
      });
    },
    async joinChatroom(chatId) {
      try {
        const chatroomRef = doc(db, "chatrooms", chatId);
        const userRef = doc(db, "users", this.userId);

        await updateDoc(chatroomRef, {
          involved_users: arrayUnion(this.userId),
        });

        await updateDoc(userRef, {
          conversations: arrayUnion(chatId),
        });

        alert("You have joined the chatroom!");
      } catch (error) {
        console.error("Error joining chatroom:", error);
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}

h2 {
  font-weight: 700;
  color: #007bff;
}

.public-chatrooms {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chatroom-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s;
}

.chatroom-card:hover {
  background-color: #e6f0ff;
}

.chatroom-info {
  display: flex;
  align-items: center;
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.chatroom-details {
  flex-grow: 1;
}

.chatroom-details h3 {
  margin: 0;
  font-weight: 500;
}

.chatroom-details p {
  margin: 5px 0 0;
  color: #555;
}

.btn {
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
