<template>
  <div>
    <Navbar />
    <section style="background-color: #eee; margin-top: 70px">
      <div class="container py-5 mt-5">
        <div class="row d-flex justify-content-center">
          <div class="col-md-12 col-lg-10">
            <div class="card" id="chat2">
              <div
                class="card-header d-flex justify-content-between align-items-center p-3"
              >
                <div class="d-flex align-items-center">
                  <img
                    :src="chatroomAvatar"
                    alt="Chat Avatar"
                    class="chat-avatar me-2"
                  />
                  <h5 class="mb-0">{{ chatName }}</h5>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="black"
                  class="bi bi-info-circle-fill info-icon"
                  viewBox="0 0 16 16"
                  data-bs-toggle="modal"
                  data-bs-target="#infoModal"
                >
                  <path
                    d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"
                  />
                </svg>
              </div>
              <div
                class="card-body"
                style="position: relative; height: 400px; overflow-y: auto"
                ref="messagesContainer"
              >
                <div
                  v-for="(message, index) in messages"
                  :key="message.id"
                  class="d-flex flex-row mb-4"
                  :class="{
                    'justify-content-start': message.sender !== currentUserId,
                    'justify-content-end': message.sender === currentUserId,
                  }"
                >
                  <img
                    v-if="message.sender !== currentUserId"
                    :src="message.senderAvatar"
                    alt="avatar"
                    class="avatar"
                  />
                  <div>
                    <p
                      v-if="isGroupChat && message.sender !== currentUserId"
                      class="message-sender"
                    >
                      {{ message.senderName }}
                    </p>
                    <p
                      :class="
                        message.sender !== currentUserId
                          ? 'message-left'
                          : 'message-right'
                      "
                    >
                      {{ message.content }}
                    </p>
                    <p class="message-time text-muted">
                      {{ message.datetime.toDate().toLocaleString() }}
                    </p>
                    <p v-if="message.sender === currentUserId && index === messages.length - 1" class="message-read-status">
                      {{ getMessageReadStatus(message) }}
                    </p>
                  </div>
                </div>
                <div class="typing-indicator-container">
                  <div
                    v-for="user in typingUsers"
                    :key="user.id"
                    class="d-flex align-items-center typing-indicator"
                  >
                    <img :src="user.avatar" alt="avatar" class="avatar" />
                    <p class="ms-2">{{ user.name }} is typing...</p>
                  </div>
                </div>
              </div>
              <div
                class="card-footer text-muted d-flex justify-content-start align-items-center p-3"
              >
                <img :src="currentUserAvatar" alt="avatar" class="avatar" />
                <input
                  type="text"
                  class="form-control form-control-lg"
                  v-model="newMessage"
                  @input="updateTypingStatus"
                  placeholder="Type message"
                />
                <button class="btn btn-dark ms-3" @click="sendMessage">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    class="bi bi-send-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Info Modal -->
    <div
      class="modal fade"
      id="infoModal"
      tabindex="-1"
      aria-labelledby="infoModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="infoModalLabel">Chat Info</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="text-center">
              <img
                :src="chatroomAvatar"
                alt="Chat Avatar"
                class="chat-avatar-large mb-3"
              />
              <h3 class="mb-3">{{ chatName }}</h3>
            </div>
            <div v-if="isGroupChat">
              <h5 class="fw-bold">Members</h5>
              <div
                v-for="member in chatMembers"
                :key="member.id"
                class="member-info mb-3"
                :class="{ 'current-user': member.id === currentUserId }"
              >
                <div class="d-flex align-items-center mb-2">
                  <img :src="member.photo" alt="avatar" class="avatar me-3" />
                  <div>
                    <p class="mb-0">{{ member.name }}</p>
                    <p class="text-muted mb-0">{{ member.email }}</p>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-2">
                  <p class="fw-bold mb-0">Status:</p>
                  <div
                    v-if="member.online"
                    class="d-flex align-items-center ms-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="green"
                      class="bi bi-toggle-on"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"
                      />
                    </svg>
                    <p class="mb-0 ms-2">Online</p>
                  </div>
                  <div v-else class="d-flex align-items-center ms-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      class="bi bi-toggle-off"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5"
                      />
                    </svg>
                    <p class="mb-0 ms-2">Offline</p>
                  </div>
                </div>
                <div class="bio-section">
                  <p class="fw-bold mb-0">Bio:</p>
                  <p class="bio-text">{{ member.bio }}</p>
                </div>
              </div>
            </div>
            <div v-else>
              <h5 class="fw-bold">Bio:</h5>
              <p class="bio-text">{{ chatBio }}</p>
              <div class="d-flex align-items-center mb-2">
                <p class="fw-bold mb-0">Status:</p>
                <div v-if="chatOnline" class="d-flex align-items-center ms-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="green"
                    class="bi bi-toggle-on"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"
                    />
                  </svg>
                  <p class="mb-0 ms-2">Online</p>
                </div>
                <div v-else class="d-flex align-items-center ms-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    class="bi bi-toggle-off"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5"
                    />
                  </svg>
                  <p class="mb-0 ms-2">Offline</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <div v-if="isGroupChat">
              <button type="button" class="btn btn-danger" @click="leaveGroup">
                Leave Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/config.js";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  arrayRemove,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import Navbar from "@/components/NavBar.vue";

export default {
  components: { Navbar },
  data() {
    return {
      messages: [],
      newMessage: "",
      chatroomId: this.$route.params.idChat,
      typingUsers: [],
      typingTimeout: null,
      currentUserId: this.$route.params.idUser,
      currentUserAvatar: "",
      chatName: "",
      chatroomAvatar: "",
      chatBio: "",
      chatOnline: false,
      isGroupChat: false,
      chatMembers: [],
    };
  },
  created() {
  this.fetchCurrentUser();
  this.fetchChatName();
  this.fetchChatMembers();

  const chatroomRef = doc(db, "chatrooms", this.chatroomId);
  onSnapshot(chatroomRef, async (snapshot) => {
    const chatroomData = snapshot.data();
    if (chatroomData) {
      if (chatroomData.message) {
        const messages = await Promise.all(
          chatroomData.message.map(async (messageId) => {
            const messageDoc = await getDoc(doc(db, "message", messageId));
            const messageData = messageDoc.data();
            const senderAvatar = await this.getUserAvatar(messageData.sender);
            const senderName = await this.getUserName(messageData.sender);
            return {
              id: messageDoc.id,
              senderAvatar,
              senderName,
              ...messageData,
            };
          })
        );

        this.messages = messages;
        this.scrollToEnd();
        this.updateMessageReadReceipts(); // Ensure this is called to update read receipts
      }

      if (chatroomData.typing_status) {
        this.updateTypingUsers(chatroomData.typing_status);
      } else {
        this.typingUsers = [];
      }
    }
  });
}
,
  methods: {
    async fetchCurrentUser() {
      const userDoc = await getDoc(doc(db, "users", this.currentUserId));
      if (userDoc.exists()) {
        this.currentUserAvatar =
          userDoc.data().photo ||
          require("@/assets/avatars/default-avatar.jpeg");
      }
    },
    async fetchChatName() {
      const chatroomDoc = await getDoc(doc(db, "chatrooms", this.chatroomId));
      if (chatroomDoc.exists()) {
        const chatroomData = chatroomDoc.data();
        if (chatroomData.involved_users.length > 2) {
          this.chatName = chatroomData.chat_name;
          this.chatroomAvatar =
            chatroomData.photo ||
            require("@/assets/avatars/default-avatar.jpeg");
          this.isGroupChat = true;
        } else {
          const otherUserId = chatroomData.involved_users.find(
            (id) => id !== this.currentUserId
          );
          const userDoc = await getDoc(doc(db, "users", otherUserId));
          if (userDoc.exists()) {
            this.chatName = userDoc.data().name;
            this.chatroomAvatar =
              userDoc.data().photo ||
              require("@/assets/avatars/default-avatar.jpeg");
            this.chatBio = userDoc.data().bio || "";
            this.chatOnline = userDoc.data().state || false;
          }
        }
      }
    },
    async fetchChatMembers() {
      const chatroomDoc = await getDoc(doc(db, "chatrooms", this.chatroomId));
      if (chatroomDoc.exists()) {
        const chatroomData = chatroomDoc.data();
        if (chatroomData.involved_users.length > 2) {
          this.isGroupChat = true;
          this.chatMembers = await Promise.all(
            chatroomData.involved_users.map(async (userId) => {
              const userDoc = await getDoc(doc(db, "users", userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                  id: userId,
                  name: userData.name,
                  photo:
                    userData.photo ||
                    require("@/assets/avatars/default-avatar.jpeg"),
                  email: userData.email,
                  bio: userData.bio,
                  online: userData.state,
                };
              }
              return null;
            })
          ).then((users) => users.filter((user) => user !== null));
        }
      }
    },
    async getUserAvatar(userId) {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return (
            userData.photo || require("@/assets/avatars/default-avatar.jpeg")
          );
        } else {
          return require("@/assets/avatars/default-avatar.jpeg");
        }
      } catch (error) {
        console.error("Error fetching user avatar:", error);
        return require("@/assets/avatars/default-avatar.jpeg");
      }
    },
    async getUserName(userId) {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return userData.name;
        } else {
          return "Unknown User";
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        return "Unknown User";
      }
    },
    async sendMessage() {
  if (this.newMessage.trim()) {
    const newMessageRef = doc(collection(db, "message"));
    const newMessageData = {
      content: this.newMessage,
      sender: this.currentUserId,
      datetime: serverTimestamp(),
      id: newMessageRef.id,
      read_receipts: [], // Initialize read_receipts as an empty array
    };
    await setDoc(newMessageRef, newMessageData);
    const chatroomRef = doc(db, "chatrooms", this.chatroomId);
    await updateDoc(chatroomRef, {
      message: arrayUnion(newMessageRef.id),
      lastMessageTimestamp: serverTimestamp(),
      [`typing_status.${this.currentUserId}`]: false,
    });

    this.newMessage = "";
    this.scrollToEnd();
    this.updateMessageReadReceipts(); // Call to update read receipts after sending a message
  }
}
,
    async updateMessageReadReceipts() {
      try {
        const batch = writeBatch(db);
        this.messages.forEach((message) => {
          if (
            message.sender !== this.currentUserId &&
            !message.read_receipts.includes(this.currentUserId)
          ) {
            const messageRef = doc(db, "message", message.id);
            batch.update(messageRef, {
              read_receipts: arrayUnion(this.currentUserId),
            });
          }
        });
        await batch.commit();
      } catch (error) {
        console.error("Error updating message read receipts:", error);
      }
    },
    async updateTypingStatus() {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }

      const chatroomRef = doc(db, "chatrooms", this.chatroomId);
      await updateDoc(chatroomRef, {
        [`typing_status.${this.currentUserId}`]: true,
      });

      this.typingTimeout = setTimeout(async () => {
        await updateDoc(chatroomRef, {
          [`typing_status.${this.currentUserId}`]: false,
        });
      }, 2000);
    },
    async updateTypingUsers(typingStatus) {
      const typingUserIds = Object.keys(typingStatus).filter(
        (userId) => userId !== this.currentUserId && typingStatus[userId]
      );

      this.typingUsers = await Promise.all(
        typingUserIds.map(async (userId) => {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            return {
              id: userId,
              name: userDoc.data().name,
              avatar:
                userDoc.data().photo ||
                require("@/assets/avatars/default-avatar.jpeg"),
            };
          }
          return null;
        })
      ).then((users) => users.filter((user) => user !== null));
    },
    async leaveGroup() {
      const conversationRef = doc(db, "chatrooms", this.chatroomId);
      const conversationDoc = await getDoc(conversationRef);

      if (conversationDoc.exists()) {
        const conversationData = conversationDoc.data();

        if (conversationData.involved_users.length > 2) {
          await updateDoc(conversationRef, {
            involved_users: arrayRemove(this.currentUserId),
          });

          const userRef = doc(db, "users", this.currentUserId);
          await updateDoc(userRef, {
            conversations: arrayRemove(this.chatroomId),
          });
          // eslint-disable-next-line no-undef
          const modal = bootstrap.Modal.getInstance(
            document.getElementById("infoModal")
          );
          modal.hide();
          this.$router.push(`/main/${this.currentUserId}`);
        }
      }
    },

    getMessageReadStatus(message) {
  if (!message.read_receipts) {
    return "";
  }
  const totalUsers = this.isGroupChat ? this.chatMembers.length : 2;
  if (message.read_receipts.length >= totalUsers - 1) {
    return "Seen";
  } else {
    return "";
  }
}
,
    scrollToEnd() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 10px;
}

.chat-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.chat-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.info-icon {
  cursor: pointer;
  margin-right: 10px;
}

.message-left {
  background-color: #f5f6f7;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 5px;
  max-width: 75%;
}

.message-right {
  background-color: #3e3f3f;
  color: white;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 5px;
  max-width: 75%;
}

.message-sender {
  text-align: start;
  margin-bottom: 3px;
}

.message-time {
  font-size: 0.75rem;
  text-align: right;
}

.message-read-status {
  font-size: 0.75rem;
  text-align: right;
  color: #007bff;
}

.typing-indicator-container {
  display: flex;
  align-items: center;
  padding: 10px;
}

.typing-indicator img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.card-footer .form-control {
  flex-grow: 1;
}

.card-footer .btn {
  margin-left: 10px;
}

.fw-bold {
  font-weight: bold;
}

.member-info {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;
}

.bio-section {
  text-align: start;
}

.bio-text {
  margin-left: 0;
}

.current-user {
  border: 2px solid #007bff;
}
</style>
