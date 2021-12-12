<template>
  <div v-bind:class='theme'>
    {{this.userName}}
    You answered {{this.answer}} which is {{this.correct}}
    You have {{this.score}} points

    <router-link v-if="!show" v-bind:to="'/poll/'+pollId+'/'+lang+'/'+userName">
      <button>
        HÄR
      </button>
    </router-link>

  </div>
</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'PollResult',
  components: {
  },
  data: function () {
    return {
      pollId: "",
      theme:"",
      lang:"",
      userName:"",
      score:"",
      answer:"",
      correct:false,
      show:true,
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
    socket.emit("getUserInfo", {pollId:this.pollId,
                               userName:this.userName});

    socket.on("userInfo",(userInfo) => {
      this.score = userInfo.score;
      this.correct=userInfo.correct;
      this.answer=userInfo.answer;
    });

    socket.on("moveOn",()=> {
      this.show = false;
    });

  },
  methods: {

  }

}
//;showPopup()
</script>
