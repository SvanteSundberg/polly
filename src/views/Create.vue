<template>
<div v-bind:class='theme'>
  <header>
   <h2>{{uiLabels.nowEdit}} <span class="cursive">{{this.pollId}} </span></h2>
  <hr>
</header>

<div class="split left">
    <h3> {{uiLabels.questionNumber}} : {{this.currentIndex+1}}

  <button id="remove"
  v-on:click="removeQuestion">
  {{uiLabels.removeQuestion}}
</button> </h3>

  <div class="question">
    <p> {{uiLabels.question}}: </p>
    <input type="text"
          class="writeQ"
          v-model="question"
          v-on:change="saveQuestion"
          :placeholder="uiLabels.typeQuestion">
    <br>
    <p> {{uiLabels.answers}}:</p>

    <div class="allAnswers">
      <textarea v-for="(_, i) in answers"
                v-model="answers[i]"
                v-bind:key="'answer'+i"
                v-on:change="saveQuestion"
                v-bind:class="'answer'+i"
                :placeholder="uiLabels.typeAnswer"
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

<router-link v-bind:to="'/'">
<button class="addBtn">
  {{uiLabels.backToStart}}
</button>
</router-link>

<button class="addBtn" v-on:click="addQuestion">
  + {{uiLabels.addQuestion}}
</button>

<router-link v-if="canContinue()" v-bind:to="'/selectQuestions/'+pollId+'/'+lang">
<button class="doneBtn" v-on:click="removeEmptyAwnser">
  {{uiLabels.selectQuestions}}
</button>
</router-link>

<button class="doneBtn"
        v-if="!canContinue()"
        v-on:click="showPopup(true)">
  {{uiLabels.selectQuestions}}
</button>

<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> Quizzer </template>
<div class="warning"> {{uiLabels.pleaseMakeSureTo}} <br>
  <ol>
<li>{{uiLabels.chooseRight}}</li>
<li> {{uiLabels.typeSomething}} </li>
<li> {{uiLabels.fillCorrect}} </li>
</ol>
</div>
</createPopup>

</div>

<div class="split right">
<div class="scroll">
  <div class="questionWrap" id="importantButtons">
     <h3 id="overView"> {{uiLabels.overview}} </h3>
    <router-link v-bind:to="'/selectTheme/'+pollId+'/'+lang">
    <button class="sideQuestion" id="themeButton">
      {{uiLabels.selectTheme}}
    </button>
  </router-link>
  <button v-for="(_, i) in this.allQuestions"
          v-bind:key="i"
          v-on:click="goToQuestion(i)"
          v-bind:class="['sideQuestion',{activeQuestion:this.currentIndex === i}]">

    {{uiLabels.sideQuestion}} {{i+1}}
  </button>
  </div>

  <div class="questionWrap" v-if="this.showHelp">
    <div class="positioningHelp">
    <div v-for="(_, i) in this.allQuestions"
          v-bind:key="i"
          v-bind:class="['helpMessage',{notDone:isNotFinished(i)}]">
          <span v-if="isNotFinished(i)"> </span>
    </div>
  </div>
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
      notFinished:[],
      showHelp:false,
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
      if(this.allQuestions.length>1){
      socket.emit("deleteQuestion", {
        pollId: this.pollId,
        questionNumber: this.currentIndex
    })
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
      socket.emit("setCorrectAnswer", {
        pollId: this.pollId,
        questionNumber: this.currentIndex,
        correctIndex:this.correctQuestion
      });
    },
    removeEmptyAwnser: function(){
      socket.emit("sendEmpty",  this.pollId
      );
    },

    canContinue: function(){
      let finished=true;
      for (let i=0;i<this.allQuestions.length;i++){
        if (!this.isCorrectAnswerFilled(i) || !this.isMarkedCorrect(i) || !this.isQuestionFilled(i)){
          finished=false;
          if (!this.notFinished.includes(i)) {
            this.notFinished.push(i);
          }
        }
        else{
          if (this.notFinished.includes(i)){
            var index = this.notFinished.indexOf(i);
            this.notFinished.splice(index,1);
          }
        }
      }
      return finished
      },

      isCorrectAnswerFilled: function(i){
       for(let x=0; x<this.allQuestions[i].c.length;x++){
         if(this.allQuestions[i].a[this.allQuestions[i].c[x]].length===0){
          return false
         }
       }
       return true
     },

     isMarkedCorrect: function(i){
       if (typeof this.allQuestions[i].c[0]=='undefined' ){
           return false
       }
       return true
     },

     isQuestionFilled: function(i){
       if (this.allQuestions[i].q==''){
        return false
        }
        return true
       },

    showPopup:function(value){
      this.popupVisable=value;
      this.showHelp=true;
    },

    isNotFinished: function(index){
      return this.notFinished.includes(index)
    }


  }
}
</script>
<style scoped>
#importantButtons{
  z-index:1;
}

.party{
  font-weight:bold;
  font-size:16pt;
}

.questionWrap {
  display: flex;
  flex-direction: column;
  position:absolute;
  top: 0;
  right: 0;
  padding-right:1.5em;
  padding-left:1.5em;
}

.scroll{
  height:100%;
  overflow-y:scroll;
  position:relative;
}


.sideQuestion {
  background-color: white;
  margin: 10px;
  border-radius: 20px;
  border-color: white;
  padding:0.5em;
  font-size:13pt;

}

.activeQuestion {
  background-color: Grey;
  border: 1px solid white;
}

#remove{
  background-color:red;
  border: 1px solid red;
  border-radius: 20px;
  cursor: pointer;
  color: #fff;
  text-align:  center;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left:  10px;
}

#remove:hover{
  font-weight: bold;
}


.allAnswers {
  display: grid;
  margin: auto;
  margin-bottom: 50px;
  padding: auto;
  width: 460px;
  height: 220px;
  grid-template-columns: 220px 220px;
  grid-template-rows: 100px 100px;
  grid-gap: 50px;
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
  height: 100px;
  width: 210px;
  resize: none;
  border-radius: 5px;
}

.removeAnswerButton {
  background-color: #d11a2a;
  height: 13px;
  width: 13px;
  margin-left:203px;
  padding:0;
  border: red;
  border-radius: 2px;
  justify-content: flex-start;
}
.removeAnswerButton::after{
    position: relative;
    content: "\d7";
    color: #fff;
    font-size:12pt;
}
.party .removeAnswerButton::after{
  top:-8px;
}

.school .removeAnswerButton::after{
  top:-4px;
  left:0.5px;
}

.standard .removeAnswerButton::after{
  top:-4.5px;
  right:0.3px;
}

#addButton{
  background-color:lightgrey;
  border: dotted;
  border-radius: 5px;
  height: 105px;
  width: 216px;
  padding: 0px;
  opacity: 0.5;
  margin:0;
  font-size:14pt;
}

.question{
  position:relative;
  /*border-style:double;*/
  margin:auto;
  padding:0px;
  padding-bottom: 10px;
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
  height: auto;
}

.right {
  width: 15%;
  height: 85%;
  right: 0;
  top: 15%;
  position:absolute;
  border-left: 2px solid white;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

.markCorrectButton{
  height: 1em;
  width: 1em;
  margin-left:11.75em;
  margin-top:40px;
}

.markCorrectButton:hover{
  cursor: pointer;
}

hr{
  margin-top:1em;
  margin-bottom:0;
  padding-bottom:0;
  margin-bottom:0;
  background-color: white;
  border:1px solid white;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

#overView{
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    margin-bottom: 0.5em;
}

p{
  margin:auto;
  width:460px;
  text-align: left;
  padding-bottom: 20px;
}

.writeQ{
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid black;
  outline: none;
  height: 50px;
  width: 478px;
  margin-right:-24px;
}

.addBtn{
  background-color: #0078d0;
  border: 1px solid #0078d0;
  border-radius: 20px;
  cursor: pointer;
  color: #fff;
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left:  10px;
}

h3{
  margin-top:1.5em;
  margin-bottom:0.5em;
}

.doneBtn{
  margin-bottom:3em;
}

button:hover{
  font-weight:bold;
}

.warning{
  text-align:center;
}

.warning ol{
  display:inline-block;
}

.helpMessage{
  border-top: 2px solid transparent;
  border-left: 2px solid transparent;
  font-size:12pt;
  width: 15px;
  height: 15px;
  transform: rotate(135deg);
  margin-right:9em;
  margin-top: 0;
  margin-bottom:2.7em;
  z-index:0;
}

.helpMessage::after{
  content: "";
  display: block;
  width: 2px;
  height: 45px;
  background-color: transparent;
  transform: rotate(-45deg) translate(15px, 4px);
}

.notDone{
  border-top: 2px solid red;
  border-left: 2px solid red;
}

.notDone::after{
  background-color: red;
}

.positioningHelp{
  margin-top:9em;
}

</style>
