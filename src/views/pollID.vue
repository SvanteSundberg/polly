<template>
  <div class='standard'>
  <label>
    {{uiLabels.writePollID}}
    <input type="text" v-model="id">
  </label>
  <router-link v-bind:to="'/poll/'+id+'/'+lang" tag="button">
    <button id="createID">
    {{uiLabels.Done}}
  </button>
  </router-link>
  </div>
</template>

<script>
// v-bind:to="'/poll/'+id"
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'pollID',
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: ""
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
  },
}
</script>
