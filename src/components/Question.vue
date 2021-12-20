<template>
<h3> <span> {{question.q}} </span>
</h3>
<div class="allAnswers">
<button v-for="a in question.a"
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
  padding:1em;
  padding-top:2.5em;
  font-size: 26pt;
}

.allAnswers {
  display: grid;
  margin: auto;
  padding: auto;
  width: 30%;
  grid-template-columns: 10em 10em;
  grid-template-rows: 5em 5em;
  grid-gap: 2em;
}

.answer {
  font-size: 18pt;
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
</style>
