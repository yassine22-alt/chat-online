<template>
  <div>
    <Navbar />
 
      <div class="myusers">
      <UserDetails
        v-for="user in filteredUsers"
        :key="user.id"
        :user="user"
        @click.native="createChat(user.id)"
      />
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/config.js";
import { collection, getDoc, getDocs, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import UserDetails from "@/components/userDetails.vue";
import Navbar from "@/components/NavBar.vue";


export default {
  components: {
    UserDetails,
    Navbar,
  },
  data() {
    return {
      users: [],
      userId: this.$route.params.id,
      userConversations: [],
    };
  },

  async mounted() {
    await this.fetchUserConversations();
    await this.fetchUsers();
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
    async fetchUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          let user = doc.data();
          user.id = doc.id;
          if (!this.userConversations.includes(user.id)) {
            this.users.push(user);
          }
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async createChat(otherUserId) {
      try {
        const chatData = {
          chat_name: "Chat",
          involved_users: [this.userId, otherUserId],
          messages: [],
          typing_status: []
        };
        const chat = await addDoc(collection(db, "chatrooms"), chatData);

        await updateDoc(doc(db, "users", this.userId), {
          conversations: arrayUnion(chat.id)
        });

        await updateDoc(doc(db, "users", otherUserId), {
          conversations: arrayUnion(chat.id)
        });

        console.log("Chat created successfully");
        this.$router.push(`/chat/${this.userId}/${chat.id}`);
      } catch (error) {
        console.error("Failed to create chat:", error);
      }
    },
    goto_newusers() {
      this.$router.push(`/newusers/${this.userId}`);
    },
    goto_profile() {
      this.$router.push(`/profile/${this.userId}`);
    },
    backto_mainpage() {
      this.$router.push(`/main/${this.userId}`);
    }
  },

  computed: {
  filteredUsers() {
    return this.users.filter((user) => {
      return !this.userConversations.includes(user.id);
    });
  },
}
};
</script>

<style>
.myusers {
  margin-top: 90px;
}
</style>
