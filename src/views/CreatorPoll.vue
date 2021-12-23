<template>
  <div v-bind:class='theme' >
      <Question v-bind:question="question"/>
    <br>
    <router-link v-if="!this.timeOn" v-bind:to="'/result/'+pollId+'/'+lang">
    <button class="doneBtn" v-on:click="toPollResult">
      Se resultat
    </button>
  </router-link>

  <div v-if="this.timeOn" > Tid: {{this.time}} </div>

  <div class="amountAnswers"> Antal svar: {{this.amountAnswers}} </div>

  </div>

<!-- <Timer v-if="this.time>0" v-bind:time="this.time" v-on:start="startTimer(this.time)"/>
  <div v-if="timesUp"> tiden är ute</div> -->

</template>

<script>
// @ is an alias to /src
//import Timer from '@/components/Timer.vue'
import Question from '@/components/Question.vue';
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'CreatorPoll',
  components: {
    Question
  },
  data: function () {
    return {
      question: {
        q: "",
        a: []
      },
      theme:"",
      pollId:"",
      lang:"",
      uiLabels:{},
      time:0,
      timeOn:false,
      amountAnswers:0,
      amountUsers:0
    }
  },

  created: function () {
    this.pollId = this.$route.params.id;
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.emit('joinPoll', {pollId:this.pollId,
                            questionNumber: null
                            });

    socket.emit("loadTheme",this.pollId);

    socket.on("initial", (theme) => {
      this.theme = theme
    });

    socket.emit("timeToStart", this.pollId);

    socket.emit('getTime',this.pollId);

    socket.on("setTime", (time)=>{
      this.time=time;
      if (time>0){
        this.timeOn=true;
        this.startTimer(this.time);
      }
    });

    socket.on("newQuestion", q => {
      this.question = q;
    });

    socket.on("dataUpdate", (update) => {
      const values = Object.values(update.a)
      const reducer = (previousValue, currentValue) => previousValue + currentValue;
      this.amountAnswers=values.reduce(reducer);
    });

    socket.emit("getUserAmount", this.pollId);

    socket.on("userAmount",(userAmount) => {
      this.amountUsers=userAmount.length;
    });


  },
  methods: {
    toPollResult: function(){
      socket.emit('toPollResult', this.pollId);
    },

    startTimer:function() {
        const timer = this.time;
        let timerGoing = true;
        let timePassed = this.time;
        const a = new Date();
        socket.emit("startTimer", {pollId: this.pollId,
                                  startTime: a,
                                  endTime: timer});
        const interval = setInterval(() => {
          if (this.time > 0 && timerGoing && this.amountUsers!==this.amountAnswers) {
            timePassed=Math.round((new Date() - a)/1000);
            this.time=timer-timePassed;
            console.log(timerGoing);
          }
          else if (timerGoing){
            timerGoing = false;
            clearInterval(interval);
            this.resetTimer(timer);
          }
        },1000);

       },

 resetTimer: function(timer){
     socket.emit('toPollResult', this.pollId);
     this.time=timer;
     console.log("har skickat att ändra view", this.time);
     this.$router.replace('/result/'+this.pollId+'/'+this.lang);
     }

  }

}
</script>

<style scoped>



  .amountAnswers{
    position:absolute;
    top:40%;
    right:0;
    margin-right:5em;
    padding:1em;
    border-radius:1em;
  }

</style>
