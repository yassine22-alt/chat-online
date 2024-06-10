<template>
  <div>
    <Navbar />
    <div class="chats">
      <ChatDetails
        v-for="chatId in userConversations"
        :key="chatId"
        :chatId="chatId"
        :userId="userId"
        @open-chat="openChat"
      />
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/config.js";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import ChatDetails from "@/components/chatDetails.vue";
import Navbar from "@/components/NavBar.vue";

export default {
  components: { ChatDetails, Navbar },
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

      onSnapshot(userDocRef, async (snapshot) => {
        if (snapshot.exists()) {
          await this.fetchUserConversations(snapshot.data().conversations);
        }
      });
    },
    async fetchUserConversations(conversationIds) {
      try {
        const conversations = [];

        for (const convoId of conversationIds) {
          const convoDoc = await getDoc(doc(db, "chatrooms", convoId));
          if (convoDoc.exists()) {
            const convoData = convoDoc.data();
            conversations.push({
              id: convoId,
              lastMessageTimestamp: convoData.lastMessageTimestamp,
            });
          }
        }

        conversations.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

        this.userConversations = conversations.map(convo => convo.id);
      } catch (error) {
        console.error("Error fetching user conversations:", error);
      }
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
