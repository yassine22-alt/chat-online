<template>
  <div class="home-page">
    <div class="welcome-message-section">
      <h1>Welcome to MyChatBox</h1>
      <p>
        <span ref="typingText"></span><span class="cursor-effect">|</span>
      </p>
      <div class="action-buttons">
        <router-link to="/signup" class="btn btn-outline-dark">Sign Up</router-link>
        <router-link to="/login" class="btn btn-outline-dark">Login</router-link>
      </div>
    </div>
    <div class="background-bubbles">
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
      <div class="bubble-element"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      welcomeMessage: "An app where you can chat with friends and family!",
      typingSpeed: 100,
    };
  },
  mounted() {
    this.typeWelcomeMessage();
  },
  methods: {
    typeWelcomeMessage() {
      const typingText = this.$refs.typingText;
      const message = this.welcomeMessage;
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < message.length) {
          typingText.textContent += message.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, this.typingSpeed);
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Reddit+Mono:wght@200..900&display=swap');

body, html {
  margin: 0;
  padding: 0;
}

.home-page {
  font-family: "Reddit Mono", monospace;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom, rgba(0, 123, 255, 0.6), #ffffff);
  padding-top: 0px;
}

.welcome-message-section {
  text-align: center;
  padding-top: 200px;
  z-index: 2;
  position: relative;
}

.welcome-message-section h1 {
  font-size: 70px;
  margin-bottom: 20px;
  color: black;
  font-weight: bold;
}

.welcome-message-section p {
  font-size: 40px;
  color: black;
  font-weight: bold;
  background-color: rgba(0, 123, 255, 0.1);
  margin-right: 130px;
  margin-left: 130px;
  padding: 50px;
  border-radius: 20px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn-outline-dark {
  font-size: 20px;
  font-weight: bold;
  padding: 10px 30px;
  border-radius: 20px;
  border: 2px solid black;
  color: black;
  background-color: rgba(0, 123, 255, 0.1);
  transition: background-color 0.3s, transform 0.3s;
}

.btn-outline-dark:hover {
  background-color: rgba(0, 123, 255, 0.2);
  transform: scale(1.05);
}

.cursor-effect {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.background-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1; /* Ensure background is behind other elements */
}

.bubble-element {
  position: absolute;
  bottom: -50px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 123, 255, 0.6);
  border-radius: 50%;
  animation: rise 10s infinite ease-in;
  opacity: 0.8;
}

.bubble-element:nth-child(odd) {
  background-color: rgba(0, 123, 255, 0.4);
}

.bubble-element:nth-child(even) {
  background-color: rgba(211, 211, 211, 0.4);
}

.bubble-element:nth-child(1) { left: 10%; animation-duration: 4s; }
.bubble-element:nth-child(2) { left: 20%; width: 50px; height: 50px; animation-duration: 5s; }
.bubble-element:nth-child(3) { left: 30%; width: 100px; height: 100px; animation-duration: 6s; }
.bubble-element:nth-child(4) { left: 40%; animation-duration: 4s; }
.bubble-element:nth-child(5) { left: 50%; width: 80px; height: 80px; animation-duration: 6s; }
.bubble-element:nth-child(6) { left: 60%; animation-duration: 5s; }
.bubble-element:nth-child(7) { left: 70%; width: 200px; height: 200px; animation-duration: 7s; }
.bubble-element:nth-child(8) { left: 80%; width: 50px; height: 50px; animation-duration: 5s; }
.bubble-element:nth-child(9) { left: 90%; width: 75px; height: 75px; animation-duration: 6s; }
.bubble-element:nth-child(10) { left: 95%; width: 30px; height: 30px; animation-duration: 4s; }
.bubble-element:nth-child(11) { left: 15%; width: 60px; height: 60px; animation-duration: 7s; }
.bubble-element:nth-child(12) { left: 25%; width: 40px; height: 40px; animation-duration: 5s; }
.bubble-element:nth-child(13) { left: 35%; width: 90px; height: 90px; animation-duration: 6s; }
.bubble-element:nth-child(14) { left: 45%; width: 70px; height: 70px; animation-duration: 8s; }
.bubble-element:nth-child(15) { left: 55%; width: 110px; height: 110px; animation-duration: 6s; }
.bubble-element:nth-child(16) { left: 65%; width: 35px; height: 35px; animation-duration: 7s; }
.bubble-element:nth-child(17) { left: 75%; width: 85px; height: 85px; animation-duration: 6s; }
.bubble-element:nth-child(18) { left: 85%; width: 95px; height: 95px; animation-duration: 7s; }
.bubble-element:nth-child(19) { left: 92%; width: 45px; height: 45px; animation-duration: 5s; }
.bubble-element:nth-child(20) { left: 5%; width: 55px; height: 55px; animation-duration: 6s; }

@keyframes rise {
  0% { bottom: -50px; transform: translateX(0); }
  50% { transform: translateX(50px); }
  100% { bottom: 100%; transform: translateX(-50px); }
}
</style>
