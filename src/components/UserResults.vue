<template>
  <div v-bind:class='theme'>
    <div v-if="checkAnswer()" class="infoAnswer">
      <h3> {{uiLabels.timeUp}} {{userName}}! </h3>
      <p> {{uiLabels.goFaster}} </p>
    </div>
    <div v-else-if="this.userinfo.correct" class="infoAnswer">
    <h3> {{uiLabels.keepGoing}} {{userName}}! </h3>
    <p> {{uiLabels.youAnswered}}
      <span class="cursive"> {{this.userinfo.answer}} </span>
        {{uiLabels.whichIs}}
    <span class="bold"> {{uiLabels.correct}}</span>
    </p>
  </div>
    <div v-else class="infoAnswer">
      <h3> {{uiLabels.canBetter}} {{userName}}!</h3>
      <p> {{uiLabels.youAnswered}}
        <span class="cursive"> {{this.userinfo.answer}} </span>
        {{uiLabels.whichIs}} <span class="bold"> wrong! </span>
      </p>
    </div>

    <div> <span class="score"> {{uiLabels.youHave}}
      {{this.userinfo.score}} {{uiLabels.points}}
    </span>
    </div>
    <!-- ha med vilken plats på leaderboard-->

  </div>
</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'PollResult',
  props: {
    userName: String,
    uiLabels: Object

  },
  data: function () {
    return {
      userinfo:{score:0,
                answer:"",
                correct:false},
      pollId:"",
    }
  },
  mounted: function () {
    this.pollId = this.$route.params.id;
    socket.emit("getUserInfo", {pollId:this.pollId,
                               userName:this.userName});

    socket.on("userInfo",(userInfo) => {
      console.log(userInfo);
      this.userinfo.score = userInfo.score;
      this.userinfo.correct = userInfo.correct;
      this.userinfo.answer = userInfo.answer;
    });

    socket.emit("checkLastQuestion", this.pollId);
    socket.on("isLastQuestion", (isFinished) => {
      if (isFinished){
        this.$emit("finished",(this.userinfo.score));
      }
    });

  },

  methods: {
    checkAnswer:function(){
      if (typeof this.userinfo.answer !== 'undefined'){
        console.log("hej");
        return false
      }
      else{
        return true
      }
    }
  }

}
//;showPopup()
</script>

<style scoped>

.infoAnswer h3{
  padding-top:2.8em;
}

.infoAnswer p{
  margin:1.5em;
  margin-bottom:3em;
}

.score{
  background-color:white;
  padding:1em;
  color:black;
  box-shadow: 10px 5px 5px black;
}
</style>
