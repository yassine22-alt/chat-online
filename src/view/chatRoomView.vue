<template>
  <div>
    <Navbar />
    <div class="messages">
      <div v-for="message in messages" :key="message.id" class="message">
        <p>
          <strong>{{ message.senderName }}:</strong> {{ message.content }}
        </p>
        <p>
          <small>{{ message.datetime.toDate().toLocaleString() }}</small>
        </p>
      </div>
      <div v-if="typingUsers.length > 0" class="typing-indicator">
        <p v-for="user in typingUsers" :key="user.id">{{ user.name }} is typing...</p>
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="newMessage" @input="updateTypingStatus" placeholder="Type a message" />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import { db } from "@/firebase/config.js";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import Navbar from "@/components/NavBar.vue";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      messages: [],
      newMessage: "",
      chatroomId: this.$route.params.idChat,
      typingUsers: [],
      typingTimeout: null,
    };
  },
  created() {
    const chatroomRef = doc(db, "chatrooms", this.chatroomId);
    onSnapshot(chatroomRef, async (snapshot) => {
      const chatroomData = snapshot.data();
      if (chatroomData) {
        if (chatroomData.message) {
          this.messages = await Promise.all(
            chatroomData.message.map(async (messageId) => {
              const messageDoc = await getDoc(doc(db, "message", messageId));
              const messageData = messageDoc.data();
              const userDoc = await getDoc(doc(db, "users", messageData.sender));
              const senderName = userDoc.data().name;
              return { id: messageDoc.id, senderName, ...messageData };
            })
          );
        }

        if (chatroomData.typing_status) {
          this.updateTypingUsers(chatroomData.typing_status);
        } else {
          this.typingUsers = [];
        }
      }
    });
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim()) {
        const newMessageRef = doc(collection(db, "message"));
        const newMessageData = {
          content: this.newMessage,
          sender: this.$route.params.idUser,
          datetime: serverTimestamp(),
          id: newMessageRef.id,
        };
        await setDoc(newMessageRef, newMessageData);
        const chatroomRef = doc(db, "chatrooms", this.chatroomId);
        await updateDoc(chatroomRef, {
          message: arrayUnion(newMessageRef.id),
          lastMessageTimestamp: serverTimestamp(),
          [`typing_status.${this.$route.params.idUser}`]: false,
        });

        this.newMessage = "";
      }
    },
    async updateTypingStatus() {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }

      const chatroomRef = doc(db, "chatrooms", this.chatroomId);
      await updateDoc(chatroomRef, {
        [`typing_status.${this.$route.params.idUser}`]: true,
      });

      this.typingTimeout = setTimeout(async () => {
        await updateDoc(chatroomRef, {
          [`typing_status.${this.$route.params.idUser}`]: false,
        });
      }, 10000); // Set typing status to false after 3 seconds of inactivity
    },
    async updateTypingUsers(typingStatus) {
      const typingUserIds = Object.keys(typingStatus).filter(
        (userId) => userId !== this.$route.params.idUser && typingStatus[userId]
      );

      this.typingUsers = await Promise.all(
        typingUserIds.map(async (userId) => {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            return { id: userId, name: userDoc.data().name };
          }
          return null;
        })
      ).then(users => users.filter(user => user !== null));
    },
  },
};
</script>

<style scoped>
.messages {
  height: 300px;
  overflow-y: scroll;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
.message {
  margin-bottom: 10px;
}
.typing-indicator {
  font-style: italic;
  color: #888;
}
</style>
