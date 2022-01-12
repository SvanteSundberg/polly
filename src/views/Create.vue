<template>
<div v-bind:class='theme' v-on:mouseup="endSwitch">
  <header>
   <h2>{{uiLabels.nowEdit}} <span class="cursive">{{this.pollId}} </span></h2>

</header>
<div class="splitgrid">
<div class="split left">
<div class="question">
    <h3> {{uiLabels.questionNumber}} : {{this.currentIndex+1}}

  <button id="remove"
  v-on:click="removeQuestion">
  {{uiLabels.removeQuestion}}
</button> </h3>

<div v-if="collide()>-1" class="help">
  {{uiLabels.drop}}
</div>


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

<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> {{uiLabels.quizzer}} </template>
<div class="warning"> {{uiLabels.pleaseMakeSureTo}} <br>
  <ol>
<li>{{uiLabels.chooseRight}}</li>
<li> {{uiLabels.typeSomething}} </li>
<li> {{uiLabels.fillCorrect}} </li>
</ol>
</div>
</createPopup>

</div>

<div class="allCreateBtn">

<div>
<router-link v-bind:to="'/'">
<button class="standBtn addBtn">
  {{uiLabels.backToStart}}
</button>
</router-link>
</div>
<div>
<button class="standBtn addBtn" v-on:click="addQuestion">
  + {{uiLabels.addQuestion}}
</button>
</div>

<router-link v-if="canContinue()" v-bind:to="'/selectQuestions/'+pollId+'/'+lang">
<button class="standBtn doneBtn" v-on:click="removeEmptyAwnser">
  {{uiLabels.Done}}
</button>
</router-link>

<div>
<button class="standBtn doneBtn"
        v-if="!canContinue()"
        v-on:click="showPopup(true)">
  {{uiLabels.Done}}
</button>
</div>
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

  <div v-on:mousemove="executeSwitch">
  <button v-for="(_, i) in this.allQuestions"
          v-bind:key="i"
          v-on:click="goToQuestion(i)"
          v-bind:class="['sideQuestion', 'nr'+i, {activeQuestion:this.currentIndex === i || this.collide()===i},
          {switchingQuestion:this.switching.index===i}]"
          v-on:mousedown="startSwitch(event, i)"
          v-bind:style= "[this.switching.index===i ? {top: this.y_koord+ 'px'} : {top:0}]">
      {{uiLabels.sideQuestion}} {{i+1}}
  </button>
  </div>
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
      switching: {isSwitching:false,
              index:-1},
      y_koord:0,

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
      this.theme = theme;
    });

    socket.on("dataUpdate", (data) =>
      this.data = data
    );
    socket.on("pollCreated", (data) =>
      this.data = data);

    socket.on("getQuestions", (questions) => {
      this.allQuestions = questions;
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
        socket.emit("addAnswers", {
          pollId: this.pollId,
          questionNumber: this.currentIndex,
          answers: this.answers
        });
      }
    },

    removeAnswer: function(i) {
      this.answers.splice(i, 1);
      this.removeAnswerOption(i);
      socket.emit("removeAnswer", {
        pollId: this.pollId,
        questionNumber: this.currentIndex,
        answerIndex:i
      });

  },

  removeAnswerOption(i){
    if (this.allQuestions[this.currentIndex].c.length>0){
      if (this.allQuestions[this.currentIndex].c.includes(i)){
        const index = this.allQuestions[this.currentIndex].c.indexOf(i);
        socket.emit('removeAnswerOption', {pollId: this.pollId,
                                          questionNumber: this.currentIndex,
                                          correctIndex:index});
      }
    }
  },

  removeQuestion: function(){
      if(this.allQuestions.length>1){
      socket.emit("deleteQuestion", {
        pollId: this.pollId,
        questionNumber: this.currentIndex
      });
    if (this.currentIndex>0){
      this.currentIndex--;
      this.goToQuestion(this.currentIndex);
    }
    else{
      this.goToQuestion(this.currentIndex);
    }
  }
  },

    goToQuestion: function(questionIndex) {
      if (typeof this.allQuestions[questionIndex] !== 'undefined'){
        this.question = this.allQuestions[questionIndex].q;
        this.answers = this.allQuestions[questionIndex].a;
        this.currentIndex = questionIndex;
        this.correctQuestion=this.allQuestions[questionIndex].c;
    }
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
    },

    startSwitch: function(event, index){
      this.goToQuestion(index);
      this.y_koord=0;
      if (!this.switching.isSwitching){
        this.switching.index=index;
        this.switching.isSwitching=true;
      }
    },

    endSwitch: function(){
      const index=this.collide();
      if (index>-1){
        let tempQuestion = this.allQuestions[this.switching.index];
        this.allQuestions[this.switching.index]= this.allQuestions[index];
        this.allQuestions[index]=tempQuestion;
        socket.emit("saveTheQuestions", {pollId:this.pollId,
                                        questions: this.allQuestions
        });
      }
      this.switching.isSwitching=false;
      this.switching.index=-1;
    },

    executeSwitch:function(){
      if (this.switching.isSwitching && !this.reachedBorder(event.clientY)){
        var offset = event.currentTarget.getBoundingClientRect().top + 60*this.switching.index;
        this.y_koord = event.clientY - offset - 35;
      }
    },

    reachedBorder:function(mouse){
      const themeButton = document.getElementById('themeButton');
      const top = themeButton.getBoundingClientRect().top;
      if (mouse<top){
        return true
      }
      return false

    },
/* Parts of collide have been taken from https://gist.github.com/yckart/7177551*/
    collide: function(theme=false){
      if (this.switching.index>-1){
        if (!theme){
          const element1=document.getElementsByClassName('nr'+this.switching.index);
          let rect1 = element1[0].getBoundingClientRect();
          for (let i=0; i<this.allQuestions.length;i++){
            if (i!==this.switching.index){
              let element2=document.getElementsByClassName('nr'+i);
              let rect2 = element2[0].getBoundingClientRect();
              let isCollide = !(rect1.top > rect2.bottom ||
              rect1.right < rect2.left ||
              rect1.bottom < rect2.top ||
              rect1.left > rect2.right
              );

              if (isCollide){
                return (i)
              }
            }
      }
    }
    }
      return -1
    },

}
}

</script>
<style scoped>
#importantButtons{
  z-index:1;
}

.questionWrap {
  display: flex;
  flex-direction: column;
  position:absolute;
  top:0;

  width: 100%;
}

.scroll{
  height:100%;
  overflow-y:auto;
  position:relative;
}

#themeButton{
  height:3vw;
}


.sideQuestion {
  background-color: white;
  margin: 5%;
  border-radius: 20px;
  border-color: white;
  padding-right:8%;
  padding-left:8%;
  height: 3vw;
  width: 150px;
  font-size: 16px;

}


.activeQuestion {
  /*background-color: Grey;
  border: 1px solid white;*/
  background-color: black;
  color:white;
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


.allAnswers {
  display: grid;
  margin: auto;
  padding: auto;
  width: 40vw;
  height: 40%;
  grid-template-columns: 40% 40%;
  grid-template-rows: 45% 45%;
  grid-column-gap: 20%;
  grid-row-gap: 10%;
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
  height: 95%;
  width: 95%;
  resize: none;
  border-radius: 5px;
}

.removeAnswerButton {
  background-color: #d11a2a;
  height: 13px;
  width: 13px;
  margin-left:92%;
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
    font-weight:bold;
}


.party .removeAnswerButton::after{
  top:-5px;
}

.school .removeAnswerButton::after{
  top:-5px;
  left:0.5px;
}


.standard .removeAnswerButton::after{
  top:-4.5px;
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
  margin:0;
  padding:0px;
  width:100%;
  height: 100%;
  overflow-x: auto;
}

header{
  padding-top:1em;
  height:10%;
}

.split {
  height: 100%;
  overflow-x: hidden;
}

.left {
  width: 80%;
  left: 0;
  top:0;
  position:relative;
  justify-content:center;
  margin-right: 10%;
  margin-left: 10%;
  right:0;
  left:0;
}

.right {
  width: 100%;
  position:relative;
  border-left: 3px solid white;
}

.allCreateBtn{
  grid-column: span 2;
  grid-row: 2;
  height: 100%;
  width: 100%;
  border-top: 2px solid white;
  display: grid;
  grid-template-columns: 30% 40% 30%;
  place-items: auto center;
}


.splitgrid{
  display: grid;
  grid-template-columns: 79vw 18vw;
  grid-template-rows: 70vh 15vh;
  width: 97vw;
  border-top: 3px solid white;
}

.markCorrectButton{
  height: 20%;
  width: 20%;
  margin-left:95%;
  margin-top:15%;
}

.markCorrectButton:hover{
  cursor: pointer;
}



#overView{
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    border-radius: 5px;
    width:80%;
    margin:10%;
}

p{
  margin:auto;
  width:70%;
  text-align: left;
  padding-bottom: 3%;
}

.writeQ{
  margin-bottom: 2%;
  border-radius: 5px;
  border: 1px solid black;
  outline: none;
  height: 10%;
  width: 62%;
  margin-left:;
}

.left h3{
  margin:auto;
  width:70%;
  padding-top: 3%;
}
h3{
  margin-top:2%;
  margin-bottom:0.5em;
}


.warning{
  text-align:center;
}

.warning ol{
  display:inline-block;
}

/* Arrow in helpMessage from https://codepen.io/MaryG/pen/WbvRrz*/

.helpMessage{
  border-top: 2px solid transparent;
  border-left: 2px solid transparent;
  font-size:13pt;
  width: 15px;
  height: 15px;
  transform: rotate(135deg);
  margin-right:8em;
  margin-top: 0.5em;
  margin-bottom:2.5em;
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
  margin-top:67%;
  margin-right: 100%;
}

.switchingQuestion{
  position:relative;
}

.help{
  width:10em;
  height:3.5em;
  padding:0.5em;
  background-color:white;
  position:absolute;
  top:0;
  right:6em;
  color:black;
}

@media (max-width: 550px) {
  .sideQuestion { font-size: 10px;height: 10%; width:80%; margin-bottom: 20%;}
  #themeButton{height:10%;}
  #overView{font-size: 11px;}
  .questionWrap {
    display: flex;
    position:relative;
    top:2%;
  }

  .left {
    width: 100%;
    height: 100%;
    left: 0;

    position:relative;
    margin:0;

  }

  .right {
    width: 80%;
    position:relative;
    /*border-left: 2px solid white;*/
    /*box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;*/

  }

  .splitgrid{
    display: grid;
    grid-template-columns: 72vw 25vw;
    width: 97vw;
  }

  .allAnswers {
    display: grid;
    margin: auto;
    margin-bottom: 15%;
    padding: 0;
    width: 80%;
    height: 80%;
    grid-template-columns: 90%;
    grid-template-rows: 20% 20% 20% 20%;
    grid-gap: 10%;
  }

  .question{
    position:relative;
    /*border-style:double;*/
    margin:0;
    padding:0px;
    padding-bottom: 10px;
    width:100%;
    height: 95%;}

    .allAnswers textarea {
      height: 90%;
      width: 90%;
      resize: none;
      border-radius: 5px;
    }

    .removeAnswerButton {
      background-color: #d11a2a;
      height: 13px;
      width: 13px;
      margin-left:86%;
      padding:0;
      border: red;
      border-radius: 2px;
      justify-content: flex-start;
    }

    .markCorrectButton{
      height: 1em;
      width: 1em;
      margin-left:95%;
      margin-top:8%;
    }

    .writeQ{
      margin-bottom: 5%;
      border-radius: 5px;
      border: 1px solid black;
      outline: none;
      height: 10%;
      width: 80%;
      margin-right:0;
    }

    p{
      margin:auto;
      width:80%;
      text-align: left;
      padding-bottom: 20px;
    }
    .answer0 {
      grid-column: 1;
      grid-row: 1;
    }

    .answer1 {
      grid-column: 1;
      grid-row: 2;
    }

    .answer2 {
      grid-column: 1;
      grid-row: 3;
    }

    .answer3 {
      grid-column: 1;
      grid-row: 4;
    }

    #addButton{
      height: 90%;
      width: 90%;
    }

    .doneBtn{
      margin-bottom: 0;
      margin-top: 5%;
}
.standBtn{
  margin-top: 0;
  margin-bottom: 0;
}

h3{
  margin-top: 2%;
  margin-left: 2%;
  font-size: 20px;
}
h2{
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 2%;
  font-size: 25px;
  height: 93%;
}

header{
  padding:0;
}

.helpMessage{
  border-top: 2px solid transparent;
  border-left: 2px solid transparent;
  font-size:5pt;
  width: 2px;
  height: 2px;
  transform: rotate(135deg);
  margin-right:8em;
  margin-top: 5em;
  margin-bottom:63%;
  z-index:0;
}

.helpMessage::after{
  content: "";
  display: none;
  width: 2px;
  height: 10px;
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
  margin-top:70%;
  margin-right: 100%;
}

#remove{
  font-size: 14px;
}

}

@media (min-width: 551px) {
  .sideQuestion { font-size: 16px;
                  margin:10px;
                 }
}

</style>
