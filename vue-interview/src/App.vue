<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <Children v-model="lovingVue" msg="Welcome to Your Vue.js App" />
    <p>{{lovingVue}}</p>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Children from "./components/Children.vue";

export default {
  name: "app",
  components: {
    HelloWorld,
    Children
  },
  data: function() {
    return {
      lovingVue: true
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
