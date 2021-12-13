<template>
  <div v-bind:class='theme'>
    <h3> Time to join! </h3>
    Pollid: {{this.id}}
    <!-- QR-KOD-->
    <p> Waiting for players to join :D </p>

  <div v-for="user in this.users" v-bind:key="user">
    {{user}}
  </div>

  <router-link v-bind:to="'/creatorPoll/'+id+'/'+lang">
  <button>
    Let's go
  </button>
  </router-link>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'SelectQuestions',
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "",
      theme:"",
    }
  },
  created: function () {
    this.id=this.$route.params.id;
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.emit("loadTheme",this.id);
    socket.on("initial", (theme) => {
      this.theme = theme
    });

  },

  methods: {

  },
}
</script>
