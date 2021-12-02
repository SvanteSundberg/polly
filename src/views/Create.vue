<template>
  <div v-bind:class='theme'>
    Poll ID: {{this.pollId}}

    <div>
      {{uiLabels.question}}:
      <input type="text" v-model="question">
      <div>
        Answers:
        <input v-for="(_, i) in answers"
               v-model="answers[i]"
               v-bind:key="'answer'+i">
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>
    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>
    <button v-on:click="saveQuestion">
      Save Changes
    </button>
    <input type="number" v-model="questionNumber">
    <button v-on:click="runQuestion">
      Run question
    </button>
    <router-link v-bind:to="'/result/'+pollId">Check result</router-link>
    <button v-for="(_, i) in this.allQuestions"
            v-bind:key="i"
            v-on:click="goToQuestion(i)">
    Question {{i+1}}
    </button>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'Create',
  data: function () {
    return {
      lang: "",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      allQuestions:[],
      data: {},
      uiLabels: {},
      theme: "",
      currentIndex: 0,
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    this.pollId = this.$route.params.id;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.emit("loadTheme",this.pollId);

    socket.on("initial", (theme) => {
      this.theme = theme
    });

    socket.on("dataUpdate", (data) =>
      this.data = data
    );
    socket.on("pollCreated", (data) =>
      this.data = data);

    socket.on("getQuestions",(questions)=>
      this.allQuestions = questions);

  },
  methods: {
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } );
      this.question= "";
      this.answers= ["", ""];
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    },
    goToQuestion: function(questionIndex){
      this.question=this.allQuestions[questionIndex].q;
      this.answers=this.allQuestions[questionIndex].a;
      this.currentIndex=questionIndex;
    },

    saveQuestion: function(){
      console.log(this.allQuestions);
      socket.emit("changeQuestion", {pollId:this.pollId, q:this.question, a: this.answers, questionNumber:this.currentIndex});
    }
  }
}
</script>
