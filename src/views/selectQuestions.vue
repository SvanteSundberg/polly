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
    <label for="i"> {{i+1}}. {{value.q}}</label>

<div class="dropdown">
  <button>
    Show Answers
    </button>
    <div class="dropdown-content">
    <p v-for="value in this.questions[i].a"
        v-bind:key="value">{{value}}
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

<router-link v-bind:to="'/creatorPoll/'+id+'/'+lang">
<button v-on:click="sendQuestions">
  Play Quiz
</button>
</router-link>

</div>
</div>
</template>
<script>

import io from 'socket.io-client';
const socket = io();
export default {
  name: 'SelectQuestions',
  data: function () {
    return {
      uiLabels: {},
      id: "",
      questions:"",
      selectedQuestions: [],
      lang: "",
      dropDownVisable: false,
      theme:""
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

  },

  methods: {
    sendQuestions: function () {
      socket.emit("pollQuestions",{pollId: this.id,
                                    selectQ:this.selectedQuestions.sort()
                                  });
      socket.emit("setAnswers", this.id);
    },

    changeDropdown: function(){
      if (this.dropDownVisable){
        this.dropDownVisable=false;
      }
      else{
        this.dropDownVisable=true;
      }
    }
  },
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

.dropdown:hover .dropdown-content {
  background-color:white;
  border:1px solid black;
  display: inline-block;
  position:absolute;
  min-width: 200px;
  z-index: 1;
}

.dropdown hr{
  border:1px dotted;
}

button:hover {
   background-color: lightgreen;
   cursor: pointer;
}

header{
  padding:1em;
}

.questions{
  margin-bottom:2em;
}

.myButtons button{
  margin:1em;
}

</style>
