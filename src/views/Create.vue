<template>
<div v-bind:class='theme'>
  <header>
  <h3>You are now editing the poll <span class="cursive">{{this.pollId}} </span></h3>
</header>
  <hr>

  <p> Question number {{this.currentIndex+1}} <span> <button id="remove"
  v-on:click="removeQuestion">
  {{uiLabels.removeQuestion}}
</button> </span> </p>

  <div class="question">
    <p> {{uiLabels.question}}: </p>
    <input type="text" v-model="question" v-on:change="saveQuestion" placeholder="Type question">
    <br>
    <p> {{uiLabels.answers}}:</p>

    <div class="allAnswers">
      <textarea v-for="(_, i) in answers" v-model="answers[i]" v-bind:key="'answer'+i" v-on:change="saveQuestion" v-bind:class="'answer'+i" placeholder="Type answer" maxlength="50">
               </textarea>
      <button v-for="(_,i) in answers" v-bind:key="'answer'+i" v-on:click="removeAnswer(i)" v-bind:class="'answer'+i">
      </button>
      <button v-if="this.answers.length<4" v-on:click="addAnswer" id="addButton">
        {{uiLabels.addAnswer}}
      </button>

    </div>
</div>
<button v-on:click="addQuestion">
  {{uiLabels.addQuestion}}
</button>

<router-link v-bind:to="'/selectQuestions/'+pollId+'/'+lang">
<button >
  {{uiLabels.selectQuestions}}
</button>
</router-link>

<div class="scroll">
  <div id="questionWrap">
    Overview
  <button v-for="(_, i) in this.allQuestions"
          v-bind:key="i"
          v-on:click="goToQuestion(i)"
          v-bind:class="['sideQuestion',{activeQuestion:this.currentIndex === i}]">

    Question {{i+1}}
    <!-- v-bind:class="['sideQuestion',{activeQuestion:i === this.currentIndex}]" -->
  </button>
</div>
</div>
</div>
</template>

<script>
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'Create',
  data: function() {
    return {
      lang: "",
      pollId: "",
      question: "",
      answers: ["", "", "", ""],
      questionNumber: 0,
      allQuestions: [],
      data: {},
      uiLabels: {},
      theme: "",
      currentIndex: 0,
    }
  },
  created: function() {
    this.lang = this.$route.params.lang;
    this.pollId = this.$route.params.id;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.emit("loadTheme", this.pollId);

    socket.on("initial", (theme) => {
      this.theme = theme
    });

    socket.on("dataUpdate", (data) =>
      this.data = data
    );
    socket.on("pollCreated", (data) =>
      this.data = data);

    socket.on("getQuestions", (questions) =>
      this.allQuestions = questions);

    socket.emit("addQuestion", {
      pollId: this.pollId,
      first: true
    });

  },
  methods: {
    addQuestion: function() {
      socket.emit("addQuestion", {
        pollId: this.pollId,
        first: false
      });
      this.question = "";
      this.answers = ["", "", "", ""];
      console.log(this.allQuestions.length);
      this.currentIndex=this.allQuestions.length;
    },
    addAnswer: function() {
      if (this.answers.length < 4) {
        this.answers.push("");
      }
    },

    removeAnswer: function(i) {
      this.answers.splice(i, 1);
      socket.emit("removeAnswer", {
        pollId: this.pollId,
        questionNumber: this.currentIndex,
        answerIndex:i
      });

  },
  removeQuestion: function(){
      console.log(this.currentIndex)
      if(this.allQuestions.length>1){
      socket.emit("deleteQuestion", {
        pollId: this.pollId,
        questionNumber: this.currentIndex
    })
    this.goToQuestion(this.questionNumber);
}},

    goToQuestion: function(questionIndex) {
      this.question = this.allQuestions[questionIndex].q;
      this.answers = this.allQuestions[questionIndex].a;
      this.currentIndex = questionIndex;
    },


    saveQuestion: function() {
      socket.emit("changeQuestion", {
        pollId: this.pollId,
        q: this.question,
        a: this.answers,
        questionNumber: this.currentIndex
      });
    },

  }
}
</script>
<style scoped>
#questionWrap {
  display: flex;
  flex-direction: column;
  position:absolute;
  top: 0;
  right: 0;
  padding:1em;
  background-color:white;
}

.scroll{
  height:100vh;
  overflow-y:scroll;
  position:relative;
}
/*ändra till position inte relativ för att få de högst upp
, dock följer scrollern ej med då*/

.sideQuestion {
  background-color: lightgreen;
  margin: 10px;
  border-radius: 20px;
}

.activeQuestion {
  background-color: yellow;
}

#remove{
  background-color: red;
  margin-left: 1em;
}


.allAnswers {
  display: grid;
  margin: auto;
  padding: auto;
  width: 300px;
  grid-template-columns: 10em 10em;
  grid-template-rows: 5em 5em;
}


.answer0 {
  grid-column: 1;
  grid-row: 1;
}

.answer1 {
  grid-column: 2;
  grid-row: 1;
}

.answer2 {
  grid-column: 1;
  grid-row: 2;
}

.answer3 {
  grid-column: 2;
  grid-row: 2;
}


.allAnswers textarea {
  height: 5em;
  width: 10em;
  resize: none;
}

.allAnswers button {
  float: right;
  /*position: absolute;*/

  background-color: red;
  height: 0.5em;
  width: 1em;
}

#addButton{
  background-color:lightgrey;
  border: dotted;
  height: 5em;
  width: 9.5em;
  opacity: 0.5;
}

.question{
  border-style:double;
  margin-left:20em;
  margin-right:20em;
}

header{
  padding:1em;
}

</style>
