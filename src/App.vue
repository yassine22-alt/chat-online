<template>
  <div id="app">
    <SignupView />
  </div>
</template>

<script>
import SignupView from './view/signupView.vue';

export default {
  name: 'App',
  components: {
    SignupView
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
