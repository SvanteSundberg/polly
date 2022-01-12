<template>
<div v-bind:class='theme' v-on:mouseup="endSwitch">
  <header>
   <h2>{{uiLabels.nowEdit}} <span class="cursive">{{this.pollId}} </span></h2>

</header>
<div class="splitgrid">
<div class="split left">
  <div v-if="collide()>-1" class="help">
    {{uiLabels.drop}}
  </div>
<div class="question">
    <h3> {{uiLabels.questionNumber}} : {{this.currentIndex+1}}

  <button id="remove"
  v-on:click="removeQuestion">
  {{uiLabels.removeQuestion}}
</button> </h3>




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

<div>
<router-link v-if="canContinue()" v-bind:to="'/selectQuestions/'+pollId+'/'+lang">
<button class="standBtn doneBtn" v-on:click="removeEmptyAwnser">
  {{uiLabels.Done}}
</button>
</router-link>


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

    <div class="upperWrap">
      <div class="upperLeft">
     <h3 id="overView"> {{uiLabels.overview}} </h3>
    <router-link v-bind:to="'/selectTheme/'+pollId+'/'+lang">
    <button class="sideQuestion" id="themeButton">
      {{uiLabels.selectTheme}}
    </button>
  </router-link>
</div>
</div>

  <div class="questionList" v-on:mousemove="executeSwitch">
  <div class="qlistLeft">
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
<div class="qlistRight" v-if="this.showHelp">
  <div v-for="(_, i) in this.allQuestions"
        v-bind:key="i"
        v-bind:class="['helpMessage',{notDone:isNotFinished(i)}]">
        <span v-if="isNotFinished(i)">
          <div class="arrow"> <i class="arrow rightA"></i></div>
        </span>
      </div>


</div>
  </div>
  </div>

</div>
</div>
</div>
</div>
<info class="info">
  <template v-slot:helpinfo> här sätter du in hjälplabel </template>
</info>
</template>

<script>
import createPopup from '@/components/createPopup.vue'
import io from 'socket.io-client';
import info from '@/components/info.vue';

const socket = io();
export default {
  name: 'Create',
  components: {
    createPopup,
    info
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

@import url("/CreateStyle.css");

</style>
