<template>
  <div v-bind:class='theme'>
    {{pollId}}
    <Question v-bind:question="question"
              v-on:answer="submitAnswer;showPopup()"/>
    <pollPopup v-show="this.pollPopupVisable" v-on:click="closePopup"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Question from '@/components/Question.vue';
import pollPopup from '@/components/pollPopup.vue'
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Poll',
  components: {
    Question,
    pollPopup
  },
  data: function () {
    return {
      question: {
        q: "",
        a: []
      },
      pollId: "inactive poll",
      theme:"",
      pollPopupVisable:false
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', {pollId: this.pollId,
                            questionNumber: null})
    socket.on("newQuestion", q =>
      this.question = q
    )
    socket.emit("loadTheme",this.pollId);

    socket.on("initial", (theme) => {
      this.theme = theme
    })
  },
  methods: {
    submitAnswer: function (answer) {
      console.log(answer);
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },

    showPopup() {
        this.pollPopupVisable = true;
        console.log(this.pollPopupVisable)
      },
      closePopup() {
        this.pollPopupVisable = false;
      }
  }
}
</script>
