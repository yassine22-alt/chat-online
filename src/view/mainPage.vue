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
          <div v-if="userConversations.length === 0" class="no-conversations" @click="goToNewUsers">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="chat-section">
        <h2>Public Chatrooms</h2>
        <PublicChatrooms :userId="userId" />
      </div>
    </div>
    <div class="background">
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
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
    goToNewUsers() {
      this.$router.push(`/newUsers/${this.userId}`);
    }
  },
};
</script>

<style>
.main-container {
  font-family: 'Roboto', sans-serif;
  position: relative; /* Ensure the main container is positioned above the background */
  z-index: 2; /* Higher z-index to be above the background */
}

.content {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin-top: 50px;
  width: 80%;
  position: relative; /* Ensure content is above the background */
  z-index: 2; /* Higher z-index to be above the background */
}

.chat-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 45%;
  height: 500px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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

.no-conversations {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
}

.chat-details {
  margin-bottom: 20px;
}

.bubble {
  position: absolute;
  bottom: -50px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 123, 255, 0.6);
  border-radius: 50%;
  animation: rise 10s infinite ease-in;
  opacity: 0.8;
}

.bubble:nth-child(odd) {
  background-color: rgba(0, 123, 255, 0.4);
}

.bubble:nth-child(even) {
  background-color: rgba(211, 211, 211, 0.4);
}

.bubble:nth-child(1) { left: 10%; animation-duration: 4s; }
.bubble:nth-child(2) { left: 20%; width: 50px; height: 50px; animation-duration: 5s; }
.bubble:nth-child(3) { left: 30%; width: 100px; height: 100px; animation-duration: 6s; }
.bubble:nth-child(4) { left: 40%; animation-duration: 4s; }
.bubble:nth-child(5) { left: 50%; width: 80px; height: 80px; animation-duration: 6s; }
.bubble:nth-child(6) { left: 60%; animation-duration: 5s; }
.bubble:nth-child(7) { left: 70%; width: 200px; height: 200px; animation-duration: 7s; }
.bubble:nth-child(8) { left: 80%; width: 50px; height: 50px; animation-duration: 5s; }
.bubble:nth-child(9) { left: 90%; width: 300px; height: 300px; animation-duration: 6s; }
.bubble:nth-child(10) { left: 95%; width: 30px; height: 30px; animation-duration: 4s; }
.bubble:nth-child(11) { left: 15%; width: 60px; height: 60px; animation-duration: 7s; }
.bubble:nth-child(12) { left: 25%; width: 40px; height: 40px; animation-duration: 5s; }
.bubble:nth-child(13) { left: 35%; width: 90px; height: 90px; animation-duration: 6s; }
.bubble:nth-child(14) { left: 45%; width: 70px; height: 70px; animation-duration: 8s; }
.bubble:nth-child(15) { left: 55%; width: 110px; height: 110px; animation-duration: 6s; }
.bubble:nth-child(16) { left: 65%; width: 35px; height: 35px; animation-duration: 7s; }
.bubble:nth-child(17) { left: 75%; width: 85px; height: 85px; animation-duration: 6s; }
.bubble:nth-child(18) { left: 85%; width: 95px; height: 95px; animation-duration: 7s; }
.bubble:nth-child(19) { left: 92%; width: 45px; height: 45px; animation-duration: 5s; }
.bubble:nth-child(20) { left: 5%; width: 55px; height: 55px; animation-duration: 6s; }

@keyframes rise {
  0% { bottom: -50px; transform: translateX(0); }
  50% { transform: translateX(50px); }
  100% { bottom: 100%; transform: translateX(-50px); }
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

</style>