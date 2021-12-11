<template>
  <div v-bind:class='theme'>

  </div>
</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'PollResult',
  components: {
  },
  data: function () {
    return {
      pollId: "",
      theme:"",
      lang:""
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.emit('joinPoll', {pollId: this.pollId,
                            questionNumber: null});
    socket.on("newQuestion", q =>
      this.question = q
    );
    socket.emit("loadTheme",this.pollId);
    socket.on("initial", (theme) => {
      this.theme = theme
    });

  },
  methods: {

  }

}
//;showPopup()
</script>
