<template>
  <div>
    <Navbar />
    <div class="container mt-5 pt-5">
      <h2 class="text-center-lg mb-4 title">Start a conversation</h2>
      <div class="row">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="col-12 col-sm-6 col-md-4 col-lg-4 mb-4"
        >
          <UserDetails :user="user" @click.native="createChat(user.id)" />
        </div>
      </div>
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
      userId: this.$route.params.idUser,
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
        const involvedUsers = this.userConversations.reduce((acc, convoId) => {
          const convoRef = doc(db, "chatrooms", convoId);
          acc.push(convoRef);
          return acc;
        }, []);

        const involvedUsersData = await Promise.all(
          involvedUsers.map(async (userRef) => {
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              return userSnap.data().involved_users;
            }
            return null;
          })
        );

        const excludedUserIds = involvedUsersData.reduce((acc, users) => {
          if (users) {
            users.forEach((userId) => {
              if (userId !== this.userId && !acc.includes(userId)) {
                acc.push(userId);
              }
            });
          }
          return acc;
        }, []);

        querySnapshot.forEach((doc) => {
          let user = doc.data();
          user.id = doc.id;
          if (!excludedUserIds.includes(user.id) && user.id !== this.userId) {
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
          message: [],
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
        return user.id !== this.userId && !this.userConversations.includes(user.id);
      });
    },
  },
};
</script>


<style>
.container {
  margin-top: 90px;
  font-family: 'Reddit Mono', monospace;
}
.title{
  color: #1d2b64;
}
</style>
