<template>
  <div v-bind:class='theme' >
    <p> {{question.q}}
    </p>
    <div class="allAnswers">
    <div v-for="(a,i) in question.a" v-bind:key="a" v-bind:class='"answer "+"nr"+i'>
      {{ a }}
    </div>

    <router-link v-if="!this.timeOn" v-bind:to="'/result/'+pollId+'/'+lang">
    <button v-on:click="toPollResult">
      Se resultat
    </button>
  </router-link>
  </div>

  <div v-if="this.timeOn" > Tid: {{this.time}} </div>

<!-- <Timer v-if="this.time>0" v-bind:time="this.time" v-on:start="startTimer(this.time)"/>
  <div v-if="timesUp"> tiden är ute</div> -->
  </div>

</template>

<script>
// @ is an alias to /src
//import Timer from '@/components/Timer.vue'
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'CreatorPoll',
  components: {
    //Timer
  },
  data: function () {
    return {
      question: "",
      theme:"",
      pollId:"",
      lang:"",
      uiLabels:{},
      time:0,
      timeOn:false
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

    socket.emit('getTime',this.pollId);

    socket.on("setTime", (time)=>{
      this.time=time;
      if (time>0){
        this.timeOn=true;
        this.startTimer(this.time);
      }
      console.log('här är tiden'+this.time);
    });

    socket.on("newQuestion", q => {
      this.question = q;
      console.log("dags för timer");
      console.log(this.time);

    });


  },
  methods: {
    toPollResult: function(){
      socket.emit('toPollResult', this.pollId);
    },

    startTimer:function() {
      console.log(this.timeOn);
      if (this.timeOn){
        let counter = this.time;
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
}
 },

 resetTimer: function(timer){
   if (this.time===0){
     console.log("ändrat popup");
     this.time=timer;
     this.$router.replace('/result/'+this.pollId+'/'+this.lang);
     }
     }

  }

}
</script>

<style scoped>

.allAnswers {
  display: grid;
  margin: auto;
  padding: auto;
  width: 300px;
  grid-template-columns: 10em 10em;
  grid-template-rows: 5em 5em;
}

.nr0 {
  grid-column: 1;
  grid-row: 1;
  background-color:lightpink;
}

.nr1 {
  grid-column: 2;
  grid-row: 1;
  background-color:lightblue;
}

.nr2 {
  grid-column: 1;
  grid-row: 2;
  background-color:lightgreen;
}

.nr3 {
  grid-column: 2;
  grid-row: 2;
  background-color:lightyellow;
}

p{
  margin-block-start: 0;
  margin-block-end: 0;
}

</style>
