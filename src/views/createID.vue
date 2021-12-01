<template>
<input type="text" v-model="pollId">
<router-link v-bind:to="'/selectTheme/'+pollId+'/'+lang">
<button v-on:click="createPoll">
  Create poll
</button>
</router-link>
{{this.pollId}}

</template>

<script>
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'Create',
  data: function () {
    return {
      lang: "",
      pollId: "",
      uiLabels: {}
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang),
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    },
    methods: {
      createPoll: function () {
        socket.emit("createPoll", {pollId: this.pollId, lang: this.lang });

      },
    },
  }
</script>
