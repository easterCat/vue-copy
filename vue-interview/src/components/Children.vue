<template>
  <div id="app">
    <input
      type="checkbox"
      v-bind:checked="lovingVue"
      v-on:change="$emit('change', $event.target.checked)"
    />

    <div class="outer" @click="handleClickEvent($event)">
      <div class="inner"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  props: ["lovingVue"],
  model: {
    prop: "lovingVue",
    event: "change"
  },
  methods: {
    handleClickEvent(e) {
      console.log("arguments :", arguments[0]);
      console.log("event :", e);
      console.log("e.target :", e.target);
      console.log("e.currentTarget :", e.currentTarget);
    }
  }
};
</script>

<style>
.outer {
  width: 300px;
  height: 300px;
  background: rebeccapurple;
}
.inner {
  width: 100px;
  height: 100px;
  background: yellowgreen;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
