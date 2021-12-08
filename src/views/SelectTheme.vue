<template>
<div v-bind:class="theme">

<h1> {{uiLabels.theme}} </h1>

<div class="themeButtons">
<button v-on:click="setTheme('party')" v-bind:class="[{chosen:this.theme === 'party'}]">{{uiLabels.party}}</button>
<button v-on:click="setTheme('school')" v-bind:class="[{chosen:this.theme === 'school'}]">{{uiLabels.school}}</button>
<button v-on:click="setTheme('standard')" v-bind:class="[{chosen:this.theme === 'standard'}]">{{uiLabels.standard}}</button>
</div>

<router-link v-bind:to="'/create/'+id+'/'+lang">
<button id="themeDone" v-on:click="chooseTheme()">{{uiLabels.Done}}</button>
</router-link>
</div>

</template>

<script>
// v-bind:to="'/poll/'+id"
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'selectTheme',
  data: function () {
    return {
      uiLabels: {},
      theme: "standard",
      id: "",
      lang: ""
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
  },

  methods: {
    setTheme: function (theme) {
      this.theme=theme;
      console.log(this.theme);
    },

    chooseTheme: function(){
      this.id=this.$route.params.id;
      console.log(this.id);
      socket.emit("chooseTheme", {pollId: this.id, theme: this.theme})
    }

  }
}
</script>

<style scoped>

#themeDone{
  font-size: 16pt;
  float: right;
  margin-right:12em;
  margin-top:3em;
}

.chosen {
  background-color: grey;
}

.themeButtons button {
  font-size: 18pt;
  margin: 2em;
  height: 5em;
  width:7em;
}

.themeButtons button:hover{
  background-color: lightgrey;
}

#themeDone:hover{
  background-color: green;
}

h1{
  padding-top: 1.5em;
  padding-bottom:1em;
}

</style>
