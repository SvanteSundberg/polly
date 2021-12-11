<template>
<div v-bind:class='theme'>
  <header>
  <h3>You are now editing the poll <span class="cursive">{{this.pollId}} </span></h3>
  <hr>
</header>

<div class="split left">
  <p> Question number {{this.currentIndex+1}} <button id="remove"
  v-on:click="removeQuestion">
  {{uiLabels.removeQuestion}}
</button> </p>

  <div class="question">
    <p> {{uiLabels.question}}: </p>
    <input type="text"
          v-model="question"
          v-on:change="saveQuestion"
          placeholder="Type question">
    <br>
    <p> {{uiLabels.answers}}:</p>

    <div class="allAnswers">
      <textarea v-for="(_, i) in answers"
                v-model="answers[i]"
                v-bind:key="'answer'+i"
                v-on:change="saveQuestion"
                v-bind:class="'answer'+i"
                placeholder="Type answer"
                maxlength="50">
               </textarea>
      <button v-for="(_,i) in answers"
              v-bind:key="'answer'+i"
              v-on:click="removeAnswer(i)"
              v-bind:class="['answer'+i, 'removeAnswerButton']">
      </button>
      <input type="checkbox"
              v-for="(_, i) in answers"
              v-bind:key="'answer'+i"
              v-model="correctQuestion"
              v-bind:value="i"
              v-bind:id="i"
              v-bind:class="['answer'+i, 'markCorrectButton']"
              v-on:change="setCorrectAnswer">

      <button v-if="this.answers.length<4" v-on:click="addAnswer" id="addButton">
        {{uiLabels.addAnswer}}
      </button>

    </div>
</div>
<button v-on:click="addQuestion">
  {{uiLabels.addQuestion}}
</button>

<router-link v-if="isAllMarkedCorrect()" v-bind:to="'/selectQuestions/'+pollId+'/'+lang">
<button>
  {{uiLabels.selectQuestions}}
</button>
</router-link>

<button v-if="!isAllMarkedCorrect()"
        v-on:click="showPopup(true)">
  {{uiLabels.selectQuestions}}
</button>

<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable"/>

</div>

<div class="split right">
<div class="scroll">
  <div id="questionWrap">
    <h3> Overview </h3>
    <router-link v-bind:to="'/selectTheme/'+pollId+'/'+lang">
    <button class="sideQuestion">
      Select theme
    </button>
  </router-link>
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
</div>
</template>

<script>
import createPopup from '@/components/createPopup.vue'
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'Create',
  components: {
    createPopup
  },
  data: function() {
    return {
      lang: "",
      pollId: "",
      question: "",
      answers: ["", "", "", ""],
      allQuestions: [],
      data: {},
      uiLabels: {},
      theme: "",
      currentIndex: 0,
      correctQuestion:[],
      popupVisable:false,
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

    socket.on("getQuestions", (questions) => {
      this.allQuestions = questions
      this.goToQuestion(this.currentIndex);
    });

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
      this.correctQuestion=[];
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
    console.log(this.questionNumber);
    if (this.currentIndex>0){
      this.currentIndex--;
      this.goToQuestion(this.currentIndex);
    }
    else{
      this.goToQuestion(this.currentIndex);
    }
}},

    goToQuestion: function(questionIndex) {
      this.question = this.allQuestions[questionIndex].q;
      this.answers = this.allQuestions[questionIndex].a;
      this.currentIndex = questionIndex;
      console.log(this.allQuestions[questionIndex].c);
      this.correctQuestion=this.allQuestions[questionIndex].c;
    },


    saveQuestion: function() {
      socket.emit("changeQuestion", {
        pollId: this.pollId,
        q: this.question,
        a: this.answers,
        questionNumber: this.currentIndex
      });
    },

    setCorrectAnswer: function(){
      console.log(this.correctQuestion);
      socket.emit("setCorrectAnswer", {
        pollId: this.pollId,
        questionNumber: this.currentIndex,
        correctIndex:this.correctQuestion
      });
    },

    isAllMarkedCorrect: function(){
      for (let i=0;i<this.allQuestions.length;i++){
        if (typeof this.allQuestions[i].c[0]=='undefined'){
          return false
        }
      }
      return true
      },

    showPopup:function(value){
      this.popupVisable=value;
    },

    showAlert:function(){
      alert("You need to select correct answer for all your questions");
    }

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
  padding:1.5em;
  background-color: white;
}

.scroll{
  height:100%;
  overflow-y:scroll;
  position:relative;
}

.sideQuestion {
  background-color: lightgreen;
  margin: 10px;
  border-radius: 20px;
  padding:0.5em;
  font-size:13pt;
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

.removeAnswerButton {
  background-color: red;
  height: 0.75em;
  width: 1em;
  margin-left:9.3em;
}

#addButton{
  background-color:lightgrey;
  border: dotted;
  height: 5.5em;
  width: 10.5em;
  opacity: 0.5;
  margin:0;
}

.question{
  position:relative;
  border-style:double;
  margin-left:15em;
  margin-right:15em;
  margin-bottom:1em;
  padding:1em;
}

header{
  padding:1em;
  padding-bottom:0;
  height:10%;
}

.split {
  height: 90%;
  overflow-x: hidden;
}

.left {
  width: 85%;
  left: 0;
  top:0;
  position:relative;
}

.right {
  width: 15%;
  right: 0;
  top: 10%;
  position:absolute;
  background-color:white;
}

.markCorrectButton{
  background-color: pink;
  height: 1em;
  width: 1em;
  margin-left:9em;
  margin-top:1.5em;
}

hr{
  margin-top:1em;
  margin-bottom:0;
  padding-bottom:0;
  margin-bottom:0;
}

</style>
