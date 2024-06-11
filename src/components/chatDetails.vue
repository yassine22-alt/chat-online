<template>
  <div class="chat-details" @click="openChat">
    <div class="user-info">
      <div class="avatar-container">
        <img :src="userAvatar || require('@/assets/avatars/default-avatar.jpeg')" class="avatar" />
        <div class="online-status">
        <svg
          v-if="otherUserOnline"
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="11"
          fill="green"
          class="bi bi-circle-fill"
          viewBox="0 0 16 16"
        >
          <circle cx="8" cy="8" r="8" />
        </svg>

        
      </div>
      </div>
      <div class="user-name-status">
        <p class="user-name">{{ chatName }}</p>
      </div>
    </div>
    <p class="last-message">{{ lastMessage }}</p>
  </div>
</template>

<script>
import { db } from "@/firebase/config.js";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export default {
  props: {
    chatId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chatName: "",
      userAvatar: "",
      lastMessage: "",
      otherUserId: "",
      otherUserOnline: false,
    };
  },
  async mounted() {
    await this.fetchChatData();
    this.setupChatListener();
    if (this.otherUserId) {
      this.setupUserPresenceListener();
    }
  },
  methods: {
    async fetchChatData() {
      try {
        const chatDoc = await getDoc(doc(db, "chatrooms", this.chatId));
        const chatData = chatDoc.data();

        if (chatData) {
          if (chatData.involved_users.length < 3) {
            this.otherUserId = chatData.involved_users.find(
              (id) => id !== this.userId
            );
            const userDoc = await getDoc(doc(db, "users", this.otherUserId));
            const userData = userDoc.data();

            this.chatName = userData.name;
            this.userAvatar = userData.photo || require('@/assets/avatars/default-avatar.jpeg');
            this.otherUserOnline = userData.state; // Check if the user is online
          } else {
            // It's a chatroom
            this.chatName = chatData.chat_name;
            this.userAvatar = chatData.photo || require('@/assets/pdp/default-grp.jpeg');
          }

          if (chatData.message && chatData.message.length > 0) {
            const lastMessageId = chatData.message[chatData.message.length - 1];
            this.fetchLastMessage(lastMessageId);
          }
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    },
    setupUserPresenceListener() {
      const userDocRef = doc(db, "users", this.otherUserId);

      onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.data();
          this.otherUserOnline = userData.state;
        }
      });
    },
    setupChatListener() {
      const chatDocRef = doc(db, "chatrooms", this.chatId);

      onSnapshot(chatDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const chatData = snapshot.data();
          if (chatData.message && chatData.message.length > 0) {
            const lastMessageId = chatData.message[chatData.message.length - 1];
            this.fetchLastMessage(lastMessageId);
          }
        }
      });
    },
    async fetchLastMessage(lastMessageId) {
      try {
        const lastMessageDoc = await getDoc(doc(db, "message", lastMessageId));
        const lastMessageData = lastMessageDoc.data();
        this.lastMessage = lastMessageData.content;
      } catch (error) {
        console.error("Error fetching last message:", error);
      }
    },
    openChat() {
      this.$emit("open-chat", this.chatId);
    },
  },
};
</script>

<style scoped>
.chat-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #007bff;
  border-radius: 8px;
  cursor: pointer;
  background-color: #e6f0ff;
  transition: background-color 0.3s;
  margin-bottom: 10px; /* Space between chat details */
}

.chat-details:hover {
  background-color: #d0e4ff;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name-status {
  display: flex;
  align-items: center;
}

.user-name {
  font-weight: 500;
  margin: 0;
}

.online-status {
  position: absolute;
  bottom: 0;
  right: 0;

}

.last-message {
  flex-grow: 1;
  text-align: right;
  margin: 0;
  color: #555;
  font-size: 0.875rem;
}
</style>