<template>
  <div v-bind:class='theme'>
    changeView {{this.changeView}}
    tiden {{this.time}}
    timeon {{this.timeOn}}

    <div id="readyGo" v-if="!isStarted">
      <h1> Get ready!</h1>
      <h2>Your username is: <span style="text-decoration:underline">{{this.userName}}</span></h2>
      <p> Wait for the host to start! </p>
  </div>

  <div v-if="isStarted">
    <Question v-if="!changeView" v-bind:question="question"
              v-on:answer="submitAnswer"/>
    <pollPopup v-show="this.pollPopupVisable"/>

    <UserResults v-on:finished="isFinished" v-bind:userName="this.userName" v-bind:uiLabels="this.uiLabels" v-if="changeView"/>

    <createPopup v-show="this.showCreatePopup" v-on:ok="goBacktoStart">
    <template v-slot:header> The quiz has come to an end... </template>
    <span>
    You recieved {{this.points}} points
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
    socket.on("newQuestion", q =>{
      this.question = q;
    });

    socket.emit("loadTheme",this.pollId);

    socket.on("initial", (theme) => {
      this.theme = theme
    });

    socket.on('changeView', () =>{
      this.changeView=!this.changeView;
      console.log("nu ändrar jag sida", this.changeView);
      this.pollPopupVisable=false;
      if (!this.changeView){
        if (this.timeOn){
          this.startTimer(this.time);
        }
      }
      console.log()
    });

    socket.on('timeToStart',()=>{
      this.isStarted=true;
      if (this.timeOn){
        this.startTimer(this.time);
      }
    });

    socket.emit('getTime',this.pollId);

    socket.on("setTime", (time)=>{
      this.time=time;
      if (time>0){
        this.timeOn=true;
      }
      console.log('här är tiden'+this.time);
    });

  },
  methods: {
    submitAnswer: function (answer) {
      console.log(answer);
      socket.emit("submitAnswer", {pollId: this.pollId,
                                  answer: answer,
                                  time: this.time,
                                  userName:this.userName});
      this.pollPopupVisable = true;
      this.hasAnswered = true;
    },

      isFinished: function(points){
        this.points=points;
        setTimeout(() => this.showCreatePopup = true, 2800);

      },

      goBacktoStart: function(){
        this.$router.replace('/');
      },

      startTimer:function(seconds) {
        let counter = seconds;
        const timer = this.time;
        const interval = setInterval(() => {
          if (counter > 0 ) {
         counter--;
         console.log(counter);
         this.time=counter;
     }
     else{
         clearInterval(interval);
         this.resetTimer(timer);
         console.log('klar')
         }
   }, 1000);
 },

resetTimer: function(timer){
  if (this.time===0){
    console.log("ändrat popup");
    this.pollPopupVisable = !this.pollPopupVisable;
    this.changeTheView();
    }
    console.log("ändrar tid")
    this.time=timer;
  },

  changeTheView: function(){
    this.changeView=true;
    this.pollPopupVisable=false;
  }
}

}
//;showPopup()
</script>
