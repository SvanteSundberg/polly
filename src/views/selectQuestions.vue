<template>
<div v-bind:class='theme'>
<header>
<h2> Which questions do you want to include in the quiz? </h2>
<hr>
</header>

<div class="questions">
<div v-for="(value,i) in this.questions"
v-bind:key="i">

  <input type="checkbox"
         v-model="selectedQuestions"
         v-bind:value="i">

<div class="dropdown">
  <button class="questionButton" v-on:click="changeDropdown(i)">
    <label> {{i+1}}. {{value.q}}</label>
    </button>
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

<p> Timer </p>
<input type="checkbox" v-model="isTimer" v-on:click="sendTime()">
<div v-if="isTimer"> Välj tid
  <button class="timerButtons"  v-for="(_, i) in timer"
          v-bind:key="i"
          v-on:click="sendTime(i)">
          {{this.timer[i]}}
  </button>
<!-- <button v-on:click="setTimeBooleans"> None </button> -->
</div>

<div class="myButtons">
<router-link v-bind:to="'/create/'+id+'/'+lang">
<button class="editplayButtons" role="button">
  Edit Quiz
</button>
</router-link>

<router-link v-if="this.selectedQuestions.length>0" v-bind:to="'/waitingRoom/'+id+'/'+lang">
<button class="editplayButtons" v-on:click="sendQuestions">
  Play Quiz
</button>
</router-link>

<button v-if="this.selectedQuestions.length===0"
        v-on:click="showPopup(true)">
  Play Quiz
</button>

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
input {
    width: 20px;
    position: relative;
    vertical-align: middle;
}

label {
    width: 200px;
    position: relative;
    display: inline-block;
    vertical-align: left;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
}

.dropdown-content p{
  margin:0.25em;
}

.dropdownShow {
  background-color:white;
  border:1px solid black;
  display:block;
  position:relative;
  min-width: 200px;
  border-radius:0;
  padding:0;
}

.dropdown hr{
  border-top:1px dotted;
  margin:0.2em;
}

.questionButton{

  align-items: center;
  appearance: none;
  background-color: #fff;
  border-radius: 24px;
  border-style: none;
  box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
  box-sizing: border-box;
  color: #3c4043;
  cursor: pointer;
  display: inline-flex;
  fill: currentcolor;
  font-family: "Google Sans",Roboto,Arial,sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  justify-content: center;
  letter-spacing: .25px;
  line-height: normal;
  max-width: 100%;
  overflow: visible;
  padding: 2px 24px;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: box-shadow 280ms cubic-bezier(.4, 0, .2, 1),opacity 15ms linear 30ms,transform 270ms cubic-bezier(0, 0, .2, 1) 0ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: auto;
  will-change: transform,opacity;
  z-index: 0;
}

.questionButton:hover {
  background: #F6F9FE;
  color: #174ea6;
}

.questionButton:active {
  box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%);
  outline: none;
}

.questionButton:focus {
  outline: none;
  border: 2px solid #4285f4;
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





button {
  font-size: 16pt;
  margin:0.5em;
}
.questions{
  margin-bottom:2em;
}

.myButtons button{
  margin:1em;
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
  font-family: Roobert,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
  min-height: 60px;
  min-width: 0;
  outline: none;
  padding: 16px 24px;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 7%;
  will-change: transform;
}

.timerButtons:disabled {
  pointer-events: none;
}

.timerButtons:hover {
  color: #fff;
  background-color: #1A1A1A;
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  transform: translateY(-2px);
}

.timerButtons:active {
  box-shadow: none;
  transform: translateY(0);
}


.timerButtons:focus {
  color: #fff;
  background-color: #1A1A1A;
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
  font-family: system-ui,-apple-system,system-ui,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",sans-serif;
  font-size: 18px;
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
}

@media (min-width: 768px) {
  .editplayButtons {
    padding: 16px 48px;
  }
}



</style>
