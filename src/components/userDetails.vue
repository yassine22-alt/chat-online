<template>
  <div class="card user-details" @click="$emit('click.stop')">
    <div
      class="d-flex justify-content-center align-items-center position-relative"
    >
      <img
        :src="user.photo || require('@/assets/avatars/default-avatar.jpeg')"
        class="profile-photo"
      />
      <div class="status-indicator">
        <svg
          v-if="user.state"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="green"
          class="bi bi-circle-fill"
          viewBox="0 0 16 16"
        >
          <circle cx="8" cy="8" r="8" />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="red"
          class="bi bi-circle-fill"
          viewBox="0 0 16 16"
        >
          <circle cx="8" cy="8" r="8" />
        </svg>
      </div>
    </div>
    <div class="card-body text-center">
      <h5 class="card-title user-name">{{ user.name }}</h5>
      <p class="card-text user-bio">{{ user.bio || "No bio available" }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Reddit+Mono:wght@200..900&display=swap");

.user-details {
  font-family: "Reddit Mono", monospace;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
}

.user-details:hover {
  transform: scale(1.05);
}

.profile-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-top: 10px;
}

.user-name {
  font-weight: bold;
  margin-top: 10px;
  color: #1d2b64;
}

.user-bio {
  color: #666;
  font-size: 14px;
}

.card-body {
  padding: 1rem;
  text-align: center;
}

.status-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.online-icon,
.offline-icon {
  width: 16px;
  height: 16px;
}

.online-icon {
  color: green;
}

.offline-icon {
  color: red;
}
</style>
