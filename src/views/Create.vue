<template>
  <div v-bind:class='theme'>
    Poll ID: {{this.pollId}}

    <div>
      {{uiLabels.question}}:
      <input type="text" v-model="question" v-on:change="saveQuestion">


        <!--<div class="answer a"> answers[0] </div>
        <div class="answer b"> answer[1]</div>
        <div class="answer c"> answer[2]</div>
        <div class="answer d"> answer[3]</div>-->

      <div class="allAnswers">
        Answers:
        <input v-for="(_, i) in answers"
               v-model="answers[i]"
               v-bind:key="'answer'+i"
               v-on:change="saveQuestion"
               v-bind:id="'answer'+i">
               </div>
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>
    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>
    <!--
    <button v-on:click="saveQuestion">
      Save Changes
    </button>-->
    <input type="number" v-model="questionNumber">
    <button v-on:click="runQuestion">
      Run question
    </button>
    <router-link v-bind:to="'/result/'+pollId">Check result</router-link>

    <div id="questionWrap">
    <button v-for="(_, i) in this.allQuestions"
            v-bind:key="i"
            v-on:click="goToQuestion(i);activateButton()"
            v-bind:class="['sideQuestion',{activeQuestion:this.buttonActive === true}]">



    Question {{i+1}}
<!-- v-bind:class="['sideQuestion',{activeQuestion:i === this.currentIndex}]" -->

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
      answers: ["", "","",""],
      questionNumber: 0,
      allQuestions:[],
      data: {},
      uiLabels: {},
      theme: "",
      currentIndex: 0,
      activeButton: false
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

    socket.emit("addQuestion", {pollId: this.pollId, q: "", a: ["",""], first:true } );

  },
  methods: {
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: "", a: ["",""], first:false } );
      this.question= "";
      this.answers= ["", "","",""];
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
      socket.emit("changeQuestion", {pollId:this.pollId, q:this.question, a: this.answers, questionNumber:this.currentIndex});
    },

    activateButton:function(){
      this.buttonActive=!this.buttonActive;
    }

  }
}
</script>
<style>

#questionWrap{
  display: flex;
  flex-direction: column;
  float:right;

}
.sideQuestion{
  background-color: lightgreen;
  margin:10px;
  border-radius: 20px;
}

.activeQuestion{
  background-color: yellow;
}

.allAnswers{
display:grid;
margin:auto;
padding:auto;
width:300px;
grid-template-columns: 10em 10em;
grid-template-rows: 5em 5em;
}

.answer {
     background-color: #444;
     color: #fff;
     border-radius: 5px;
     padding: 20px;
     font-size: auto;
 }

 #answer0 {
     grid-column: 1 ;
     grid-row: 1;
 }
 #answer1 {
     grid-column: 1 ;
     grid-row: 2;
 }
 #answer2 {
     grid-column: 2 ;
     grid-row: 1;
 }
 #answer3 {
     grid-column: 2 ;
     grid-row: 2 ;
 }






</style>
