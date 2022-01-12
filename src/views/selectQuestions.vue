<template>
<div v-bind:class='theme'>
<header>
<h2 id ="header"> {{uiLabels.whichque}} </h2>

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
<button class="standBtn addBtn" role="button">
  {{uiLabels.editQuiz}}
</button>
</router-link>

<router-link v-if="this.selectedQuestions.length>0" v-bind:to="'/waitingRoom/'+id+'/'+lang">
<button class="standBtn doneBtn" v-on:click="sendQuestions">
  {{uiLabels.startQuiz}}
</button>
</router-link>

<button v-if="this.selectedQuestions.length===0"
        v-on:click="showPopup(true)"
        class="standBtn doneBtn">
  {{uiLabels.playQuiz}}
</button>
</div>

<div class="split right">

<p> {{uiLabels.timer}} </p>
<div class="timerSwitch">


<input id="timerSwitch" class="timerInput" type="checkbox" v-model="isTimer" v-on:click="sendTime()">
<label for="timerSwitch" class="timerLabel">Switch</label>
</div>
<div v-if="isTimer"> <p class="setTimer"> {{uiLabels.setTime}} </p>
  <button class="timerButtons"
          v-for="(value, i) in timer"
          v-bind:key="i"
          v-on:click="sendTime(i)"
          v-bind:class="[{chosen: this.time===value}]">
          {{value}} s
  </button>
<!-- <button v-on:click="setTimeBooleans"> None </button> -->
</div>
</div>

<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> {{uiLabels.quizzer}} </template>
<span> {{uiLabels.oneQuestion}}
</span>
</createPopup>

</div>
</div>
<info>
  <template v-slot:helpinfo>{{uiLabels.infoselectquestions}}</template>
</info>
</template>
<script>

import createPopup from '@/components/createPopup.vue'
import io from 'socket.io-client';
import info from '@/components/info.vue';

const socket = io();
export default {
  name: 'SelectQuestions',
  components: {
    createPopup,
    info,
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
  display:block;
  position:relative;
  width: 100%;
  padding:0.1em;
  padding-bottom:0.25em;
  font-size: 14pt;
  box-sizing: none;
  margin-top:0.3em;
  margin-left:10%;

}

.dropdown hr{
  border-top:1px;
  margin:0.2em;
}

.questionButton{
  margin-left:10%;
  margin-top:10%;
  align-items: center;
  border-radius: 23px;
  background-color: #fff;
  width:20vw;
  position: relative;
  text-align: center;
  will-change: transform,opacity;
  padding:0.5em;
  font-size:15pt;
  border-style: none;
}

.questionButton:hover {
  background:#fff;
  color: #174ea6;
}

.showDrop{
  outline: none;
  border: 1px solid black;

}

.questions{
  margin-bottom:10%;
}

.myButtons button{
  margin:7%;
  font-size:15pt;
  padding:2vh;
  border-radius: 50px;
  width:7em;
}
.myButtons{
  margin-left:40%;
  margin-top:0;
  margin-right:10%;
}

.pic{
  float:right;
  width: 15px;
  padding-right:1em;
  padding-left: 0.5em;
  padding-top:0.3em;
}

.timerButtons {
  background-color: transparent;
  border: 2px solid #1A1A1A;
  border-radius: 15px;
  color: black;
  display: inline-block;
  margin: 2%;
  height: 4em;
  min-width:4em;
  margin-top:1%;
}

.school .timerButtons{
  color: white;
  border: 2px solid white;

}

.timerButtons:hover {
  color: white;
  background-color: black;
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
}

.chosen {
  color: white;
  background-color: black;
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
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
height:25vh;
padding-top:1em;
}

header hr{
  margin-top:1em;
  margin-bottom:1em;
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
  width:60%;
  overflow-y:auto;
  position:relative;
}

.split {
  height: 75vh;
  top: 24vh;
  position:fixed;
}

.left {
  left: 0;
  width: 70%;
  margin-left:0.7em;
}

.right {
  right: 10%;
  width: 30%;
  margin-top:1.3em;
}

.setTimer{
  margin-bottom:2vh;
}
@media (max-width:550px) {
  #header{
    font-size:75%;
  }
  header{
  height:15vh;
  padding-top:1.5em;
  }
  .scroll{
    margin:0em;
    width: 90%;
  }

  .split{
    font-size: 80%;
  }
  .left{
    width: 15em;
    margin:0em;
  }
  .right{
    margin-top: 0em;
    width: 20%;
  }
  .questionButton{
    margin-top:10%;
    font-size: 90%;
    width:30vw;
    left:0px;
    text-align: center;
    will-change: transform,opacity;
    padding:0.5em;
  }
  .timerButtons{
    font-size: 75%;
    padding:0.5em;
  }



  }
</style>
