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
  <button v-on:click="changeDropdown(i)">
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

<div class="myButtons">
<router-link v-bind:to="'/create/'+id+'/'+lang">
<button>
  Edit Quiz
</button>
</router-link>

<router-link v-if="this.selectedQuestions.length>0" v-bind:to="'/waitingRoom/'+id+'/'+lang">
<button v-on:click="sendQuestions">
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
    socket.on("getQuestions", (questions) =>
    this.questions = questions);

    socket.emit("loadTheme",this.id);
    socket.on("initial", (theme) => {
      this.theme = theme
    });

    for (let i;i<this.questions.length;i++){
      this.dropDownVisable[i]=false;
    }

  },

  methods: {
    sendQuestions: function () {
      socket.emit("pollQuestions",{pollId: this.id,
                                    selectQ:this.selectedQuestions.sort()
                                  });
      socket.emit("setAnswers", this.id);
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

button:hover {
   background-color: lightgreen;
}

header{
  padding:1em;
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


</style>
