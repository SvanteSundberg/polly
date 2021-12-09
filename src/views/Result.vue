<template>
  <div v-bind:class='theme'>
    {{this.question}}
    {{this.finished}}

    <Bars v-bind:data="data"/>

<router-link v-if="finished===false" v-bind:to="'/creatorPoll/'+pollId+'/'+lang">
    <button v-on:click="runQuestion">
      Run next question
    </button>
  </router-link>
  <router-link v-if="finished===true" v-bind:to="'/createID/'+ lang">
      <button>
        Back to Start
      </button>
    </router-link>
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
      finished: false,
      lang:""
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.emit('joinPoll', {pollId: this.pollId,
                            questionNumber: null})

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

    socket.emit("checkLastQuestion", this.pollId);
    socket.on("isLastQuestion", (isFinished) => {
      this.finished = isFinished;
    });
  },

methods: {
  runQuestion: function() {
    socket.emit("runQuestion", this.pollId);
  },
}

}
</script>
