<template>
  <div class="main-container">
    <Navbar />
    <div class="content">
      <div class="chat-section">
        <h2>My Conversations</h2>
        <div class="chats">
          <ChatDetails
            v-for="chat in userConversations"
            :key="chat.id"
            :chatId="chat.id"
            :userId="userId"
            @open-chat="openChat"
          />
        </div>
      </div>
      <div class="chat-section">
        <h2>Public Chatrooms</h2>
        <PublicChatrooms :userId="userId" />
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/config.js";
import { doc, onSnapshot } from "firebase/firestore";
import ChatDetails from "@/components/chatDetails.vue";
import Navbar from "@/components/NavBar.vue";
import PublicChatrooms from "@/components/publicChatrooms.vue";

export default {
  components: { ChatDetails, Navbar, PublicChatrooms },
  data() {
    return {
      userId: null,
      userConversations: [],
    };
  },
  async mounted() {
    this.userId = this.$route.params.idUser;
    this.setupUserConversationsListener();
  },
  methods: {
    setupUserConversationsListener() {
      const userDocRef = doc(db, "users", this.userId);

      onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const conversationIds = snapshot.data().conversations || [];
          this.userConversations = [];
          conversationIds.forEach((convoId) => this.setupConversationListener(convoId));
        }
      });
    },
    setupConversationListener(convoId) {
      const convoDocRef = doc(db, "chatrooms", convoId);

      onSnapshot(convoDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const convoData = snapshot.data();
          const convo = {
            id: convoId,
            lastMessageTimestamp: convoData.lastMessageTimestamp || 0,
          };

          const index = this.userConversations.findIndex((convo) => convo.id === convoId);

          if (index !== -1) {
            this.userConversations.splice(index, 1, convo);
          } else {
            this.userConversations.push(convo);
          }

          this.userConversations.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
        } else {
          // Handle case where the conversation document does not exist
          const convo = {
            id: convoId,
            lastMessageTimestamp: 0,
          };
          
          const index = this.userConversations.findIndex((convo) => convo.id === convoId);

          if (index === -1) {
            this.userConversations.push(convo);
          }
        }
      });
    },
    openChat(chatId) {
      this.$router.push(`/chat/${this.userId}/${chatId}`);
    },
  },
};
</script>

<style>
.main-container {
  font-family: 'Roboto', sans-serif;
}

.content {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.chat-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 80%;
  height: 500px; 
  display: flex;
  flex-direction: column;
  overflow-y: auto; 
  margin: 50px;
}
.chat-section h2 {
  font-weight: 700;
  color: #007bff;
  margin-bottom: 20px;
}

.chats {
  flex-grow: 1;
  margin-top: 10px;
}

.chat-details {
  margin-bottom: 20px; /* Space between chat details */
}
</style>
