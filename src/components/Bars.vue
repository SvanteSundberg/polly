<template>
<div class="wrapper">
  <div class="bar"
        v-for="(item, key) in data"
        v-bind:key="key"
        v-bind:class="'answers'">
    <div v-bind:style="{height: 4+item*6 + 'px'}">
         <span class> {{item}} </span>
    </div>
    <div>
      {{key}}
    </div>
    <div v-for="correct in correctAnswer"
         v-bind:key="correct"
         v-bind:class= "[{falseAnswer:correct !== key}]">
    </div>
    </div>

<p>Correct answer is
<span class="cursive" v-for="correct in correctAnswer" v-bind:key="correct">
   {{correct+' '}}</span>
   </p>
</div>
</template>

<!-- [correct !== key ? opacity:0.1]] -->

<script>
export default {
  name: 'Bars',
  props: {
    data: Object,
    correctAnswer:Array
}
}
</script>

<style scoped>
.bar {
  display: inline-block;
  width: 50px;
  vertical-align: bottom;
}

.falseAnswer{
  opacity:0.1;
}

.bar span {
  position: relative;
  top: -1.2em;
}
.bar:nth-child(1) div:nth-child(1) {
  background-color:red;
}
.bar:nth-child(2) div:nth-child(1) {
  background-color:blue;
}
.bar:nth-child(3) div:nth-child(1) {
  background-color:teal;
}
.bar:nth-child(4) div:nth-child(1) {
  background-color:purple;
}

.answers{
  padding:0.5em;
}

.wrapper {
  padding:3em;
}
</style>
