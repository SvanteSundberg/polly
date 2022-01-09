<template>
<div v-bind:class='theme'>
<header>
<h2> {{uiLabels.whichque}} </h2>

<hr>
</header>

<div class="split left">
<div class="scroll">
<div class="questions">
<div v-for="(value,i) in this.questions"
v-bind:key="i">

  <input type="checkbox"
         v-model="selectedQuestions"
         v-bind:value="i"
         class="check"
         name="checkbox-i">

<div class="dropdown">
  <label for="checkbox-i">
  <button class="questionButton"
          v-on:click="changeDropdown(i)"
          v-bind:class="[{showDrop:this.dropDownVisable[i]}]">
    {{i+1}}. {{value.q}}
    </button>
  </label>

    <div v-bind:class="['dropdown-content',{dropdownShow:this.dropDownVisable[i]}]">
    <p v-for="(value,index) in this.questions[i].a"
        v-bind:key="value">
        <img v-if="isCorrect(index,i)" class="pic" src="https://cdn.pixabay.com/photo/2013/07/13/10/48/check-157822_1280.png">
        <img v-else class="pic" src="https://www.seekpng.com/png/detail/332-3324212_incorrect-cliparts-may-5.png">
        {{value}}
      <span> <hr> </span> </p>
    </div>
</div>
</div>
</div>
</div>

<div class="myButtons">
<router-link v-bind:to="'/create/'+id+'/'+lang">
<button class="editplayButtons" role="button">
  {{uiLabels.editQuiz}}
</button>
</router-link>

<router-link v-if="this.selectedQuestions.length>0" v-bind:to="'/waitingRoom/'+id+'/'+lang">
<button class="editplayButtons" v-on:click="sendQuestions">
  {{uiLabels.playQuiz}}
</button>
</router-link>

<button v-if="this.selectedQuestions.length===0"
        v-on:click="showPopup(true)"
        class="editplayButtons">
  Play Quiz
</button>
</div>

<div class="split right">

<p> Timer </p>
<div class="timerSwitch">


<input id="timerSwitch" class="timerInput" type="checkbox" v-model="isTimer" v-on:click="sendTime()">
<label for="timerSwitch" class="timerLabel">Switch</label>
</div>
<div v-if="isTimer"> {{uiLabels.setTime}}
  <br>
  <button class="timerButtons"
          v-for="(value, i) in timer"
          v-bind:key="i"
          v-on:click="sendTime(i)"
          v-bind:class="[{chosen: this.time===value}]">
          {{value}}
  </button>
<!-- <button v-on:click="setTimeBooleans"> None </button> -->
</div>
</div>

<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> Quizzer </template>
<span> Please choose at least one question before continuing!
</span>
</createPopup>

</div>
</div>
</template>
<script>

import createPopup from '@/components/createPopup.vue'
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'SelectQuestions',
  components: {
    createPopup
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      questions:"",
      selectedQuestions: [],
      lang: "",
      dropDownVisable: [],
      theme:"",
      popupVisable:false,
      time:0,
      isTimer:false,
      timer:[10,20,30],

    }
  },
  created: function () {
    this.id=this.$route.params.id;
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.emit("recieveQuestions",this.id);
    socket.on("getQuestions", (questions) => {
      this.questions = questions;
      this.selectedQuestions=[...Array(questions.length).keys()];

    });

    socket.emit("loadTheme",this.id);
    socket.on("initial", (theme) => {
      this.theme = theme
    });

  },

  methods: {
    sendQuestions: function () {
      socket.emit("pollQuestions",{pollId: this.id,
                                    selectQ:this.selectedQuestions.sort()
                                  });
      socket.emit("setAnswers", this.id);
      socket.emit('timer',this.id, this.time);
    },

    changeDropdown: function(index){
      if (this.dropDownVisable[index]){
        this.dropDownVisable[index]=false;
      }
      else{
        this.dropDownVisable[index]=true;
      }
    },

    isCorrect: function(indexAnswer, indexQuestion){
      let correctAnswersIndex=this.questions[indexQuestion].c;
      for (let i=0;i<correctAnswersIndex.length;i++){
        if (indexAnswer===correctAnswersIndex[i]){
          return true
        }
      }
      return false
  },

  showPopup:function(value){
    this.popupVisable=value;
  },

  sendTime:function(i=-1){
    console.log(i);
    if (i<0 && this.time == 0){
      this.time=this.timer[0];
    }
    else if (i<0 && this.time !== 0){
      this.time=0;
    }
    else{
      this.time=this.timer[i];
    }
    console.log("tiden är", this.time)
  },
}
}
</script>


<style scoped>

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  color:black;
}

.dropdown-content p{
  margin:0.25em;
}

.dropdownShow {
  background-color:white;
  /*border:1px solid black;*/
  display:block;
  position:relative;
  width: 100%;
  border-radius:0;
  padding:0.1em;
  padding-bottom:0.25em;
  font-size: 14pt;
  box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
  margin-top:0.3em;
  margin-left:1em;
}

.dropdown hr{
  border-top:1px dotted;
  margin:0.2em;
}

.questionButton{
  margin-left:10%;
  margin-top:1em;
  align-items: center;
  appearance: none;
  background-color: #fff;
  border-radius: 24px;
  border-style: none;
  box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
  box-sizing: border-box;
  display: inline-flex;
  fill: currentcolor;
  /*font-family: "Google Sans",Roboto,Arial,sans-serif;*/
  font-weight: 500;
  justify-content: center;
  letter-spacing: .25px;
  line-height: normal;
  /*max-width: 100%;*/
  min-width: 100%;
  overflow: visible;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: box-shadow 280ms cubic-bezier(.4, 0, .2, 1),opacity 15ms linear 30ms,transform 270ms cubic-bezier(0, 0, .2, 1) 0ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  will-change: transform,opacity;
  padding:0.5em;
  font-size:15pt;
}

.questionButton:hover {
  background: #F6F9FE;
  color: #174ea6;
  font-weight:bold;
}

.showDrop{
  outline: none;
  /*border: 2px solid #4285f4;*/
  border: 2px solid black;
}

.questionButton:active {
  box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%);
  outline: none;
}

.questionButton:not(:disabled) {
  box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
}

.questionButton:not(:disabled):hover {
  box-shadow: rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px;
}

.questionButton:not(:disabled):focus {
  box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
}

.questionButton:not(:disabled):active {
  box-shadow: rgba(60, 64, 67, .3) 0 4px 4px 0, rgba(60, 64, 67, .15) 0 8px 12px 6px;
}

.questionButton:disabled {
  box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
}

.questions{
  margin-bottom:10%;
}

.myButtons button{
  margin:5%;
  z-index:2;
}

.myButtons{
  margin-left:40%;
  margin-top:0;
  z-index:2;
}

.pic{
  float:right;
  width: 15px;
  padding-right:1em;
  padding-top:0.3em;
}

.timerButtons {
  appearance: none;
  background-color: transparent;
  border: 2px solid #1A1A1A;
  border-radius: 15px;
  box-sizing: border-box;
  color: #3B3B3B;
  cursor: pointer;
  display: inline-block;
  /*font-family: Roobert,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";*/
  font-weight: 600;
  line-height: normal;
  margin: 5%;
  height: 60px;
  min-width:60px;
  /*min-width:0;*/
  outline: none;
  /*padding: 16px 24px;*/
  margin-top:1%;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 7%;
  will-change: transform;
}

.school .timerButtons{
  color: white;
  border: 2px solid white;

}

.timerButtons:disabled {
  pointer-events: none;
}

.timerButtons:hover {
  color: #fff;
  background-color: black;
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  transform: translateY(-2px);
}

.timerButtons:active {
  box-shadow: none;
  transform: translateY(0);
}

.chosen {
  color: #fff;
  background-color: black;
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  transform: translateY(-2px);
}

.editplayButtons {
  background-color: #0078d0;
  border: 0;
  border-radius: 56px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  /*font-family: system-ui,-apple-system,system-ui,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",sans-serif;*/
  font-weight: 600;
  outline: 0;
  padding: 16px 21px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: all .3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.editplayButtons:before {
  background-color: initial;
  background-image: linear-gradient(#fff 0, rgba(255, 255, 255, 0) 100%);
  border-radius: 125px;
  content: "";
  height: 50%;
  left: 4%;
  opacity: .5;
  position: absolute;
  top: 0;
  transition: all .3s;
  width: 92%;
}

.editplayButtons:hover {
  box-shadow: rgba(255, 255, 255, .2) 0 3px 15px inset, rgba(0, 0, 0, .1) 0 3px 5px, rgba(0, 0, 0, .1) 0 10px 13px;
  transform: scale(1.05);
  background-color: lightgreen;
}

@media (min-width: 768px) {
  .editplayButtons {
    padding: 16px 48px;
  }
}

.timerInput {
  display: none;
}

.timerLabel {
  display: block;
  width: 48px;
  height: 24px;
  text-indent: -150%;
  clip: rect(0 0 0 0);
  color: transparent;
  user-select: none;
}

.timerLabel::before,
.timerLabel::after {
  content: "";
  display: block;
  position: absolute;
  cursor: pointer;
}
.timerLabel::before {
  width: 100%;
  height: 100%;
  background-color: #dedede;
  border-radius: 9999em;
  -webkit-transition: background-color 0.25s ease;
  transition: background-color 0.25s ease;
}
.timerLabel::after {
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.45);
  -webkit-transition: left 0.25s ease;
  transition: left 0.25s ease;
}
.timerInput:checked + .timerLabel::before {
  background-color: #0078d0;
}
.timerInput:checked + .timerLabel::after {
  left: 24px;
}

.timerSwitch {
  position: relative;
  display: inline-block;
  margin-bottom:1em;
  margin-top:0.3em;
}

header{
height:20%;
padding-top:1em;
}

header hr{
  margin-top:1em;
  margin-bottom:0;
  padding-bottom:0;
  margin-bottom:0;
  background-color: white;
  border:1px solid white;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

.check{
  height: 1em;
  width: 1em;
  position:relative;
}

.scroll{
  height:65%;
  width:50%;
  overflow-y:auto;
  position:relative;
}

.split {
  height: 80%;
  top: 20%;
  position:fixed;
}

.left {
  left: 0;
  width: 70%;
  margin-left:1em;
}

.right {
  right: 10%;
  width: 30%;
  margin-top:1em;
}


</style>
