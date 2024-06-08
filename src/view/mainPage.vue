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
import { doc, getDoc } from "firebase/firestore";
import ChatDetails from "@/components/chatDetails.vue";
import Navbar from "@/components/NavBar.vue";

export default {
  components: {
    ChatDetails,
    Navbar,
  },
  data() {
    return {
      userId: null,
      userConversations: [],
    };
  },
  async mounted() {
    this.userId = this.$route.params.id;
    await this.fetchUserConversations();
  },
  methods: {
    async fetchUserConversations() {
      try {
        const userDoc = await getDoc(doc(db, "users", this.userId));
        if (userDoc.exists()) {
          this.userConversations = userDoc.data().conversations || [];
        }
      } catch (error) {
        console.error("Error fetching user conversations:", error);
      }
    },
    openChat(chatId) {
      this.$router.push(`/chat/${this.userId}/${chatId}`);
    },
    goto_newusers() {
      this.$router.push(`/newusers/${this.userId}`);
    },
    goto_profile() {
      this.$router.push(`/profile/${this.userId}`);
    },
    backto_mainpage() {
      this.$router.push(`/main/${this.userId}`);
    },
  },
};
</script>

<style>
.chats {
  margin-top: 90px;
}
</style>
