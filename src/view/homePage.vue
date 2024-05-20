<template>
    <div class="home">
      <nav class="navbar fixed-top navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src="@/assets/MyChatBox_transparent.png" alt="MyChatBox Logo" width="200" class="d-inline-block align-top">
          </a>
          <div class="d-flex ms-auto">
            <router-link to="/signup" class="btn btn-outline-dark me-2">Sign Up</router-link>
            <router-link to="/login" class="btn btn-outline-dark">Log In</router-link>
          </div>
        </div>
      </nav>
  
      <div class="welcome-message">
        <h1>Welcome to MyChatBox</h1>
        <p>
          <span ref="typingText"></span><span class="cursor">|</span>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        welcomeMessage: "An app where you can chat with friends and family",
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
  .home {
    min-height: 100vh;
    position: relative;
  }
  
  .welcome-message {
    text-align: center;
    padding-top: 250px;
  }
  
  .welcome-message h1 {
    font-size: 70px;
    margin-bottom: 20px;
    color: black; 
    font-weight: bold;
    
  }
  
  .welcome-message p {
    font-size: 40px;
    color: black; 
    font-weight: bold; 
    background-color: #b5b5b5;
    margin-right: 130px;
    margin-left: 130px;
    padding: 50px;
    border-radius: 20px;
  }
  
  .cursor {
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  </style>
  
  