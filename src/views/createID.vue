<template>
<input type="text" v-model="pollId">
<router-link v-bind:to="'/create/'+lang">
<button v-on:click="createPoll">
  Create poll
</button>
</router-link>
{{data}}

</template>

<script>
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'Create',
  data: function () {
    return {
      lang: "",
      theme: "",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {}
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang),
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.on("dataUpdate", (data) =>
      this.data = data
    )},
    methods: {
      createPoll: function () {
        socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      },
    },
  }
</script>
