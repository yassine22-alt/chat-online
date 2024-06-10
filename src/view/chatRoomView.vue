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
      </div>
      <form @submit.prevent="sendMessage">
        <input v-model="newMessage" placeholder="Type a message" />
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
      };
    },
    created() {
      const chatroomRef = doc(db, "chatrooms", this.chatroomId);
      onSnapshot(chatroomRef, async (snapshot) => {
        const chatroomData = snapshot.data();
        if (chatroomData && chatroomData.message) {
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
          console.log(this.chatroomId);
          await setDoc(newMessageRef, newMessageData);
          const chatroomRef = doc(db, "chatrooms", this.chatroomId);
          await updateDoc(chatroomRef, {
            message: arrayUnion(newMessageRef.id),
            lastMessageTimestamp: serverTimestamp()
          });
  
          this.newMessage = "";
        }
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
  </style>