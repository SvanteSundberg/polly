<template>
  <div v-bind:class='theme'>
    {{this.question}}

    <Bars v-bind:data="data"/>

    <button v-on:click="runQuestion">
      Run question
    </button>
    {{this.pollQuestions}}
  </div>

</template>

<script>
// @ is an alias to /src
import Bars from '@/components/Bars.vue';
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Result',
  components: {
    Bars
  },
  data: function () {
    return {
      question: "",
      data: {},
      theme:"",
      pollId:"",
      pollQuestions:[],
      questionIndex: 0
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', {pollId:this.pollId,
                              questionNumber: this.pollQuestions[this.questionIndex]
                            });
    socket.on("dataUpdate", (update) => {
      this.data = update.a;
      this.question = update.q;
    });
    socket.on("newQuestion", update => {
      this.question = update.q;
      this.data = {};
    });
    socket.emit("loadTheme",this.pollId);

    socket.on("initial", (theme) => {
      this.theme = theme
    });

    socket.emit("loadSelectedQuestions", this.pollId);

    socket.on("selectedQuestions",(pollQuestions) => {
      this.pollQuestions=pollQuestions;
      console.log("steg  3");
    });
  },

methods: {
  runQuestion: function() {
    let questionNmr=this.pollQuestions[this.questionIndex];
    this.questionIndex++;
    socket.emit("runQuestion", {
      pollId: this.pollId,
      questionNumber: questionNmr
    })
  },
}

}
</script>
