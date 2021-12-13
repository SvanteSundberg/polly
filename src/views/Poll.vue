<template>
  <div v-bind:class='theme'>

    <Question v-if="!changeView" v-bind:question="question"
              v-on:answer="submitAnswer"/>
    <pollPopup v-show="this.pollPopupVisable"/>

    <UserResults v-on:finished="isFinished" v-bind:userName="this.userName" v-bind:uiLabels="this.uiLabels" v-if="changeView"/>

    <createPopup v-show="this.showCreatePopup">
    <template v-slot:header> The quiz has come to an end... </template>
    <span>
    You recieved {{this.points}} points
    </span>
    </createPopup>

  </div>

</template>

<script>
// @ is an alias to /src
import Question from '@/components/Question.vue';
import UserResults from '@/components/UserResults.vue';
import pollPopup from '@/components/pollPopup.vue';
import createPopup from '@/components/createPopup.vue';
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
    socket.on("newQuestion", q =>
      this.question = q
    );
    socket.emit("loadTheme",this.pollId);

    socket.on("initial", (theme) => {
      this.theme = theme
    });

    socket.on('changeView', () =>{
      if (this.changeView){
        this.changeView=false;
      }
      else{
        this.changeView=true;
      }
      this.pollPopupVisable=false;
    });

    socket.on('timeToStart',()=>{
      console.log("Waitingroom has spoken");
    });

  },
  methods: {
    submitAnswer: function (answer) {
      console.log(answer);
      socket.emit("submitAnswer", {pollId: this.pollId,
                                  answer: answer,
                                  userName:this.userName});
      this.showPopup();
    },

    showPopup: function() {
        this.pollPopupVisable = true;
        console.log(this.pollPopupVisable)
      },

      isFinished: function(points){
        this.points=points;
        setTimeout(() => this.showCreatePopup = true, 2800);

      }
  }
}
//;showPopup()
</script>
