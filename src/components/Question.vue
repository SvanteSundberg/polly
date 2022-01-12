<template>
<h3> <span> {{question.q}} </span>
</h3>
<div class="allAnswers">
<button v-for="(a,i) in question.a"
        v-on:click="answer(a)"
        v-bind:key="a"
        v-bind:class='"answer "+"nr"+i'>
  {{ a }}
</button>
</div>
</template>

<script>
export default {
  name: 'Bars',
  props: {
    question: Object
  },
  methods: {
    answer: function (answer) {
      this.$emit("answer", answer);
    }
  }
}
</script>

<style scoped>

h3 {
  padding:0.5em;
  padding-top:2.5em;
  font-size: 26pt;
}

.allAnswers {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  margin-left:25%;
  margin-right:27.5%;
  grid-gap:10%;
}

.answer {
  font-size:2vw;
  color:white;
  text-shadow: 1.5px 1.5px black;
  width:90%;
  height:6em;
  margin-top:10%;
  border-radius: 5px;
}

.nr0 {
  grid-column: 1;
  grid-row: 1;
  background-color:blue;
}

.nr1 {
  grid-column: 2;
  grid-row: 1;
  background-color:#CC0066;
}

.nr2 {
  grid-column: 1;
  grid-row: 2;
  background-color:teal;
}

.nr3 {
  grid-column: 2;
  grid-row: 2;
  background-color: #FFAA33;
}

/*Annan layout för mobil */
@media (max-width:551px){
  .allAnswers {
    display: flex;
    flex-wrap:wrap;
    margin-left:32%;
  }

  .answer{
    font-size:2vh;
  }
}
</style>
