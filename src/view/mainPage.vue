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
import { doc, onSnapshot, getDoc } from "firebase/firestore";
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

      onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          this.fetchUserConversations(snapshot.data().conversations);
        } else {
          console.error("No such document!");
        }
      });
    },
    async fetchUserConversations(conversationIds) {
      try {
        const conversations = await Promise.all(
          conversationIds.map(async (convoId) => {
            const convoDoc = await getDoc(doc(db, "chatrooms", convoId));
            if (convoDoc.exists()) {
              const convoData = convoDoc.data();
              return {
                id: convoId,
                lastMessageTimestamp: convoData.lastMessageTimestamp,
              };
            }
            return null;
          })
        );

        const sortedConversations = conversations
          .filter(convo => convo !== null)
          .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

        this.userConversations = sortedConversations.map(convo => convo.id);
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
