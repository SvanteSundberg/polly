<template>
<div class="wrapper">
  <div class="bar"
        v-for="(item, key) in data"
        v-bind:key="key"
        v-bind:class="['answers',{falseAnswer:!isCorrect(key)}]">
    <div v-bind:style="{height: 4+item*6 + 'px'}">
         <span class> {{item}} </span>
    </div>
    <div>
      {{key}}
    </div>
    </div>

<p>Correct answer is
<span class="cursive" v-for="correct in correctAnswer" v-bind:key="correct">
   {{correct+' '}}</span>
   </p>
</div>
</template>

<script>
export default {
  name: 'Bars',
  props: {
    data: Object,
    correctAnswer:Array
},

methods: {
  isCorrect: function(key){
    for (let i=0;i<this.correctAnswer.length;i++){
      if (key===this.correctAnswer[i]){
        return true
      }
    }
    return false
},
}
}
</script>

<style scoped>
.bar {
  display: inline-block;
  width: 100px;
  vertical-align: bottom;
}

.falseAnswer{
  opacity:0.4;
}

.bar span {
  position: relative;
  top: -1.4em;
}
.bar:nth-child(1) div:nth-child(1) {
  background-color:#CC0066;
}
.bar:nth-child(2) div:nth-child(1) {
  background-color:blue;
}
.bar:nth-child(3) div:nth-child(1) {
  background-color:teal;
}
.bar:nth-child(4) div:nth-child(1) {
  background-color:#FFAA33;
}

.answers{
  padding:1em;
}

.wrapper {
  padding-top:3em;
  padding-bottom:3em;
}
</style>
