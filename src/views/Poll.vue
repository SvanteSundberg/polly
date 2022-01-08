<template>
  <div v-bind:class='theme'>
    <div id="readyGo" v-if="!isStarted">
      <h1> {{uiLabels.getReady}} {{this.userName}}!</h1>
      <h3> {{uiLabels.waitingHost}} </h3>

      <div class="loading">

      </div>
  </div>

  <div v-if="isStarted">
    <Question v-if="!changeView" v-bind:question="question"
              v-on:answer="submitAnswer"/>
    <pollPopup v-show="this.pollPopupVisable" v-bind:uiLabels="uiLabels"/>

    <UserResults v-on:finished="isFinished" v-bind:userName="this.userName" v-bind:uiLabels="this.uiLabels" v-if="changeView"/>

    <createPopup v-show="this.showCreatePopup" v-on:stop="goBacktoStart">
    <template v-slot:header> {{uiLabels.quizEnded}} </template>
    <span>
    {{uiLabels.recieved}} {{this.points}} {{uiLabels.points}}
    </span>
    </createPopup>

<div v-if="this.timeOn && !this.changeView">Tid: {{this.time}}</div>
  </div>
</div>

</template>

<script>
// @ is an alias to /src
import Question from '@/components/Question.vue';
import UserResults from '@/components/UserResults.vue';
import pollPopup from '@/components/pollPopup.vue';
import createPopup from '@/components/createPopup.vue';
//import startTimer from '@/views/CreatorPoll.vue';
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Poll',
  components: {
    Question,
    pollPopup,
    UserResults,
    createPopup
  },
  data: function () {
    return {
      question: {
        q: "",
        a: []
      },
      pollId: "",
      theme:"",
      pollPopupVisable:false,
      lang:"",
      changeView:false,
      userName:"",
      showCreatePopup:false,
      uiLabels:{},
      points:0,
      timeOn:false,
      time:0,
      isStarted:false,
      hasAnswered: false
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
    socket.emit('joinPoll', this.pollId);
    socket.on("newQuestion", q =>{
      this.question = q;
    });

    socket.emit("loadTheme",this.pollId);

    socket.on("initial", (theme) => {
      this.theme = theme
    });

    socket.on("setTime", (time)=>{
      this.time=time;
      if (time>0){
        this.timeOn=true;
        this.startTimer(this.time);
      }
    });

    socket.on("timerStart", (info) => {
      this.timeOn=true;
      this.startTimer(info.endTime, info.startTime);
    });

    socket.on('changeView', (value) =>{
      console.log("har tagit emot att ändra view");
      this.changeView=value;
      this.pollPopupVisable=false;
      this.hasAnswered=false;
    });

    socket.on('timeToStart',()=>{
      this.isStarted=true;
    });

  },
  methods: {
    submitAnswer: function (answer) {
      console.log(answer);
      let userTime=this.time;
      if (!this.timeOn){
        userTime=10;
      }
      socket.emit("submitAnswer", {pollId: this.pollId,
                                  answer: answer,
                                  time: userTime,
                                  userName:this.userName});
      this.pollPopupVisable = true;
      this.hasAnswered = true;
    },

      isFinished: function(points){
        this.points=points;
        setTimeout(() => this.showCreatePopup = true, 3000);

      },

      goBacktoStart: function(){
        this.$router.replace('/');
      },

      startTimer:function(end) {
        const timer = end;
        let timePassed = end;
        let timerGoing = true;
        this.time=end;
        this.timeOn=true;
        const a = new Date();
        const interval = setInterval(() => {
          if (this.time > 0 && !this.hasAnswered && timerGoing) {
            timePassed=Math.round((new Date() - a)/1000);
            this.time=timer-timePassed;
            console.log(timerGoing);
          }
          else if (timerGoing){
            timerGoing=false;
            clearInterval(interval);
            this.resetTimer();
          }
        },1000);
 },

resetTimer: function(){
  if (this.time===0 && !this.hasAnswered){
    this.pollPopupVisable = false;
    }
  },

  changeTheView: function(){
    this.changeView=true;
    this.pollPopupVisable=false;
  }
}

}
//;showPopup()
</script>

<style scoped>

h1 {
  padding:1.5em;
}

</style>
