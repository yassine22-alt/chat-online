<template>
  <div>
    <Navbar />
    <div class="chats">
      <ChatDetails
        v-for="chat in userConversations"
        :key="chat.id"
        :chatId="chat.id"
        :userId="userId"
        @open-chat="openChat"
      />
    </div>
    <PublicChatrooms :userId="userId" />
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
.chats {
  margin-top: 90px;
}
</style>
