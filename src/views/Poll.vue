<template>
  <div v-bind:class='theme'>
    {{pollId}}
    {{this.userName}}
    <Question v-bind:question="question"
              v-on:answer="submitAnswer"/>
    <pollPopup v-show="this.pollPopupVisable"/>


    <router-link v-if="changeView" v-bind:to="'/pollResult/'+pollId+'/'+lang+'/'+userName">
      <button>
        HÄR
      </button>
    </router-link>
    <!-- OBS tillfällig lösning -->

    {{this.userName}}

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
      pollId: "",
      theme:"",
      pollPopupVisable:false,
      lang:"",
      changeView:false,
      userName:""
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.lang = this.$route.params.lang;
    this.userName = this.$route.params.user;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.emit('joinPoll', {pollId: this.pollId,
                            questionNumber: null});
    socket.on("newQuestion", q =>
      this.question = q
    );
    socket.emit("loadTheme",this.pollId);

    socket.on("initial", (theme) => {
      this.theme = theme
    });

    socket.on('changeView', () =>{
      this.changeView=true;
      this.pollPopupVisable=false;
    });

  },
  methods: {
    submitAnswer: function (answer) {
      console.log(answer);
      socket.emit("submitAnswer", {pollId: this.pollId,
                                  answer: answer,
                                  userName:this.userName});
      this.showPopup();
    },

    showPopup() {
        this.pollPopupVisable = true;
        console.log(this.pollPopupVisable)
      },
  }
}
//;showPopup()
</script>
