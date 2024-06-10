<template>
  <div class="chat-details" @click="openChat">
    <div class="user-info">
      <img :src="require('@/assets/avatars/default-avatar.jpeg')" class="avatar" />
      <p class="user-name">{{ chatName }}</p>
    </div>
    <p class="last-message">{{ lastMessage }}</p>
  </div>
</template>

<script>
import { db } from "@/firebase/config.js";
import { doc, getDoc } from "firebase/firestore";

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
    };
  },
  async mounted() {
    await this.fetchChatData();
  },
  methods: {
    async fetchChatData() {
      try {
        const chatDoc = await getDoc(doc(db, "chatrooms", this.chatId));
        const chatData = chatDoc.data();

        if (chatData) {
          if (chatData.involved_users.length < 3) {
          
            const otherUserId = chatData.involved_users.find(
              (id) => id !== this.userId
            );
            const userDoc = await getDoc(doc(db, "users", otherUserId));
            const userData = userDoc.data();

            this.chatName = userData.name;
          }

          else {
            this.chatName = chatData.chat_name;
          }
          if (chatData.message.length > 0) {
            const lastMessageId = chatData.message[chatData.message.length - 1];

            const lastMessageDoc = await getDoc(
              doc(db, "message", lastMessageId)
            );
            const lastMessageData = lastMessageDoc.data();
            this.lastMessage = lastMessageData.content;
          }
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
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
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  font-weight: bold;
  margin: 0;
}

.last-message {
  flex-grow: 1;
  text-align: right;
  margin: 0;
}
</style>
