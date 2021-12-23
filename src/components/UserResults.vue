<template>
  <div v-bind:class='theme'>
    <div v-if="checkAnswer()">
      <h3> {{uiLabels.timeUp}} {{userName}}! </h3>
      <p> {{uiLabels.goFaster}} </p>
    </div>
    <div v-else-if="this.userinfo.correct">
    <h3> {{uiLabels.keepGoing}}{{userName}}! </h3>
    <p> {{uiLabels.youAnswered}} {{this.userinfo.answer}} {{uiLabels.whichIs}} <span class="bold"> correct </span>
    </p>
  </div>
    <div v-else>
      <h3> {{uiLabels.canBetter}} </h3>
      <p> {{uiLabels.youAnswered}} {{this.userinfo.answer}} {{uiLabels.whichIs}} <span class="bold"> wrong </span>
      </p>
    </div>
    <p> {{uiLabels.youHave}} {{this.userinfo.score}} {{uiLabels.points}} </p>
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
                correct:false}
    }
  },
  mounted: function () {
    this.pollId = this.$route.params.id;
    this.lang = this.$route.params.lang;
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
