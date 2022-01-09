<template>
  <div v-bind:class='theme'>

    <div class="split left">
      <header>
      <h1>{{this.question}} </h1>
    </header>

    <Bars v-bind:data="data" v-bind:correctAnswer='this.correctAnswer'/>

    <button v-if="!finished" class="standBtn doneBtn" v-on:click="runQuestion">
      {{uiLabels.runNextQ}}
    </button>

    <router-link v-if="finished" v-bind:to="'/'">
        <button class="standBtn addBtn">
          {{uiLabels.backToStart}}
        </button>
    </router-link>

    <button class="standBtn addBtn" v-on:click="restart">
        {{uiLabels.restart}}
    </button>

  <div class="split right">
    <Leaderboard v-bind:users="this.users"/>
  </div>

  </div>
</div>

</template>

<script>
// @ is an alias to /src
import Bars from '@/components/Bars.vue';
import Leaderboard from '@/components/Leaderboard.vue';
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Result',
  components: {
    Leaderboard,
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
      users:[],
      uiLabels:{}
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.emit('joinPoll', this.pollId);

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
    socket.emit("startTimer",this.pollId);
    this.$router.replace('/creatorPoll/'+this.pollId+'/'+this.lang);
  },

  restart:function(){
    socket.emit("restart", this.pollId);
    this.$router.replace('/waitingRoom/'+this.pollId+'/'+this.lang);
  }
}

}
</script>

<style scoped>

.split {
  height: 100%;
  top: 0;
  position:fixed;
}

.left {
  left: 0;
  width: 55%;
  margin-left:5%;

}

.right {
  padding-top:6em;
  margin-right:1%;
  right: 0;
  width: 39%;
  border-left: 4px solid white;
}

header{
  padding-top:2em;
}

</style>
