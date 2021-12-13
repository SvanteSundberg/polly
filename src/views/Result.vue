<template>
  <div v-bind:class='theme'>
    {{this.question}}

    <Bars v-bind:data="data" v-bind:correctAnswer='this.correctAnswer'/>
    <Leaderboard v-bind:users="this.users"/>

<router-link v-if="!finished" v-bind:to="'/creatorPoll/'+pollId+'/'+lang">
    <button v-on:click="runQuestion">
      Run next question
    </button>
  </router-link>
  <router-link v-if="finished" v-bind:to="'/'">
      <button>
        Back to Start
      </button>
    </router-link>
  </div>

</template>

<script>
// @ is an alias to /src
import Bars from '@/components/Bars.vue';
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Result',
  components: {
    Bars
  },
  data: function () {
    return {
      question: "",
      data: {},
      correctAnswer:[],
      theme:"",
      pollId:"",
      finished: false,
      lang:"",
      users:""
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
                            questionNumber: null})

    socket.on("dataUpdate", (update) => {
      this.data = update.a;
      this.question = update.q;
    });
    socket.on("newQuestion", update => {
      this.question = update.q;
      for (let i=0;i<update.c.length;i++){
        this.correctAnswer[i] = update.a[update.c[i]];
      }
      this.data = {};
    });
    socket.emit("loadTheme",this.pollId);

    socket.on("initial", (theme) => {
      this.theme = theme
    });
    socket.emit("checkLastQuestion", this.pollId);
    socket.on("isLastQuestion", (isFinished) => {
      this.finished = isFinished;
    });
    socket.emit("requestUsers", this.pollId);
      socket.on("getUsers",(getUsers) => {
        this.users = getUsers;
      });

  },

methods: {
  runQuestion: function() {
    socket.emit("runQuestion", this.pollId);
    socket.emit("nextQ",this.pollId);
  },
}

}
</script>
