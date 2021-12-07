<template>
Välj frågor
<hr>

<form v-for="(value,i) in this.questions"
v-bind:key="i">

<input type="checkbox"
       v-model="selectedQuestions"
       v-bind:value="i">
<label for="i"> {{value.q}}</label>
</form>

<router-link v-bind:to="'/creatorPoll/'+id">
<button v-on:click="sendQuestions">
  Play Quiz
</button>
</router-link>
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
      selectedQuestions: []
      //lang: "en"
    }
  },
  created: function () {
    this.id=this.$route.params.id;
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.emit("recieveQuestions",this.id);
    socket.on("getQuestions", (questions) =>
    this.questions = questions);

  },

  methods: {
    sendQuestions: function () {
      socket.emit("pollQuestions",{pollId: this.id,
                                    selectQ:this.selectedQuestions.sort()
                                  });
      //socket.emit("setAnswers",this.id);
    },
  },
}
</script>
