<template>
<div class="wrapper">
    <div class="bar"
          v-for="(item, key) in data"
          v-bind:key="key"
          v-bind:class="['answers',{falseAnswer:!isCorrect(key)}]">
      <div v-bind:style="{height: 4+item*6 + 'px'}">
           <span> {{item}} </span>
      </div>
    </div>

      <div v-for="(item, key) in data"
            v-bind:key="key"
            v-bind:class="['options',{right:isCorrect(key)}]">
        {{key}}
      </div>
  </div>

<p id="correctcss">{{uiLabels.correctAnswer}} <span v-if="this.correctAnswer.length>1"> are </span>
  <span v-else> is </span>
<span class="cursive" v-for="(correct,i) in correctAnswer" v-bind:key="i">
   {{correct+' '}}
<span v-if="i+2==this.correctAnswer.length"> och </span>
<span v-else-if="i+1<this.correctAnswer.length"> , </span>
 </span>
   </p>
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
  width: 100%;
  grid-row:1;
}

.falseAnswer{
  opacity:0.4;
}

.bar span {
  position: relative;
  top: -1.4em;
}
.bar:nth-child(1) div:nth-child(1) {
  background-color:blue;
  column:1;
}
.bar:nth-child(2) div:nth-child(1) {
  background-color:#CC0066;
  column:2;
}
.bar:nth-child(3) div:nth-child(1) {
  background-color:teal;
  column:3;
}
.bar:nth-child(4) div:nth-child(1) {
  background-color:#FFAA33;
  column:4;
}

.right{
  font-weight:bold;
}

.wrapper {
  padding-top:5em;
  padding-bottom:3em;
  display: grid;
  grid-template-columns: 20% 20% 20% 20%;
  grid-template-rows: 100% 100%;
  grid-gap:5%;
}

#correctcss{
  margin-right: 10%;
  text-align:left;
}

.options{
  grid-row:2;
}


@media (max-width:551px){

}


</style>
