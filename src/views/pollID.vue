<template>
  <label>
    {{uiLabels.writePollID}}
    <input type="text" v-model="id">
  </label>
  <router-link v-bind:to="'/poll/'+id" tag="button">
    <button id="createID">
    {{uiLabels.Done}}
  </button>
  </router-link>
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
      //lang: "en"
    }
  },
  created: function () {
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
}
</script>
