<template>
  <div class='standard'>
<label>
  {{uiLabels.writePollID}}
  <input type="text" v-model="pollId" placeholder="Type name of the poll">
</label>
<router-link v-bind:to="'/selectTheme/'+pollId+'/'+lang">
<button v-on:click="createPoll">
  {{uiLabels.Done}}
</button>
</router-link>
{{this.pollId}}
</div>

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
