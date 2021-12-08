<template>
  <div v-bind:class='theme'>
    <p> {{question.q}}
    </p>
    <div class="allAnswers">
    <div v-for="(a,i) in question.a" v-bind:key="a" v-bind:class='"answer "+"nr"+i'>
      {{ a }}
    </div>

    <router-link v-bind:to="'/result/'+pollId">
    <button>
      Se resultat
    </button>
  </router-link>
  </div>

  </div>

</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'CreatorPoll',
  data: function () {
    return {
      question: "",
      theme:"",
      pollId:"",
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.emit('joinPoll', {pollId:this.pollId,
                            questionNumber: null
                            });

    socket.on("newQuestion", q =>
      this.question = q
    );

    socket.emit("loadTheme",this.pollId);

    socket.on("initial", (theme) => {
      this.theme = theme
    });

  },

}
</script>

<style scoped>

.allAnswers {
  display: grid;
  margin: auto;
  padding: auto;
  width: 300px;
  grid-template-columns: 10em 10em;
  grid-template-rows: 5em 5em;
}

.nr0 {
  grid-column: 1;
  grid-row: 1;
  background-color:lightpink;
}

.nr1 {
  grid-column: 2;
  grid-row: 1;
  background-color:lightblue;
}

.nr2 {
  grid-column: 1;
  grid-row: 2;
  background-color:lightgreen;
}

.nr3 {
  grid-column: 2;
  grid-row: 2;
  background-color:lightyellow;
}

p{
  margin-block-start: 0;
  margin-block-end: 0;
}

</style>
