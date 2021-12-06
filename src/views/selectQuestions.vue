<template>
Välj frågor
<hr>

<form v-for="(value,i) in this.questions"
v-bind:key="i">

<input type="checkbox" checked
       v-model="selectedQuestions"
       v-bind:value="i">
<label for="i"> {{value.q}}</label>
</form>
</template>
<script>

import io from 'socket.io-client';
const socket = io();
export default {
  name: 'selectQuestions',
  data: function () {
    return {
      uiLabels: {},
      id: "",
      questions:""
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
}
</script>
