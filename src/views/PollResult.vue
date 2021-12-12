<template>
  <div v-bind:class='theme'>
    <div v-if="this.correct">
    <h3> Keep this going! </h3>
    <p> You answered {{this.answer}} which is <span class="bold"> correct </span>
    </p>
  </div>
    <div v-else>
      <h3> You can do better! </h3>
      <p> You answered {{this.answer}} which is <span class="bold"> wrong </span>
      </p>
    </div>
    <p> You have {{this.score}} points </p>
    <!-- ha med vilken plats på leaderboard-->

    <createPopup v-show="this.showPopup">
    <template v-slot:header> The quiz has come to an end... </template>
    <span>
    You recieved {{this.score}} points
    </span>
    </createPopup>

    <router-link v-if="!show" v-bind:to="'/poll/'+pollId+'/'+lang+'/'+userName">
      <button>
        HÄR
      </button>
    </router-link>

  </div>
</template>

<script>
// @ is an alias to /src
import createPopup from '@/components/createPopup.vue';
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'PollResult',
  components: {
    createPopup
  },
  data: function () {
    return {
      pollId: "",
      theme:"",
      lang:"",
      userName:"",
      score:"",
      answer:"",
      correct:false,
      show: true,
      showPopup:false,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.lang = this.$route.params.lang;
    this.userName = this.$route.params.user;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.emit('joinPoll', {pollId: this.pollId,
                            questionNumber: null});
    socket.emit("checkLastQuestion", this.pollId);
    socket.on("isLastQuestion", (isFinished) => {
      if (isFinished){
        this.show=true;
        console.log(this.show);
        this.showPopup=true;
      }
    });

    socket.emit("loadTheme",this.pollId);
    socket.on("initial", (theme) => {
      this.theme = theme
    });
    socket.emit("getUserInfo", {pollId:this.pollId,
                               userName:this.userName});

    socket.on("userInfo",(userInfo) => {
      this.score = userInfo.score;
      this.correct=userInfo.correct;
      this.answer=userInfo.answer;
    });

    socket.on("moveOn",()=> {
      this.show = false;
    });

  },

}
//;showPopup()
</script>
