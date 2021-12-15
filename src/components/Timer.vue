<template>
<div class="timer">
tid: {{time}}

<button v-on:click="start">start</button>
</div>
</template>

<script>
export default {
  name: 'Timer',
  props:{
    time: Number
  },
  methods: {

    start: function () {
      this.$emit("start");
 }
  }
}





</script>

<style>/*
.timer{
  border: solid 5px black;
  width: 30px;
  height:30px;
}
*/</style>
