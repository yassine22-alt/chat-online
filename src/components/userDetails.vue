<template>
    <div class="user-details mt-1">
      <img :src=user.photo class="profile-photo"/>
      <div class="user-name">{{ user.name }}</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      user: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .user-details {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    margin: 10px;
  }
  
  .profile-photo {
    width: 50px;
    height: 50px;
    border-radius: 50%; 
    margin-right: 10px;
  }
  
  .user-name {
    font-size: 16px;
    color: #333;
  }
  </style>
  