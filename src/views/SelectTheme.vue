<template>
  <info>
    <template v-slot:helpinfo> här sätter du in hjälplabel </template>
  </info>
<div v-bind:class="theme">

<h1> {{uiLabels.theme}} </h1>

<div class="myButtons">
<button v-on:click="setTheme('party')" v-bind:class="['themeButton',{chosen:this.theme === 'party'}]">{{uiLabels.party}}</button>
<button v-on:click="setTheme('school')" v-bind:class="['themeButton',{chosen:this.theme === 'school'}]">{{uiLabels.school}}</button>
<button v-on:click="setTheme('standard')" v-bind:class="['themeButton',{chosen:this.theme === 'standard'}]">{{uiLabels.standard}}</button>
</div>

<router-link v-bind:to="'/create/'+id+'/'+lang">
<button class="standBtn doneBtn" v-on:click="chooseTheme()">{{uiLabels.Done}}</button>
</router-link>

</div>

</template>

<script>
// v-bind:to="'/poll/'+id"
import io from 'socket.io-client';
import info from '@/components/info.vue';
const socket = io();
export default {
  name: 'selectTheme',
  data: function () {
    return {
      uiLabels: {},
      theme: "",
      id: "",
      lang: "",
      info,
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    this.id=this.$route.params.id;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.emit("loadTheme", this.id);
    socket.on("initial", (theme) => {
      console.log(theme);
      this.theme = theme
    });
  },

  methods: {
    setTheme: function (theme) {
      this.theme=theme;
      console.log(this.theme);
    },

    chooseTheme: function(){
      console.log(this.id);
      socket.emit("chooseTheme", {pollId: this.id, theme: this.theme})
    }

  }
}
</script>

<style scoped>
.doneBtn{
  font-size: 16pt;
  float: right;
  margin-right:17%;
  margin-top:8%;
}


.themeButton {
  background:transparent;
  color:black;
  border:2.5px solid black;
  font-size: 18pt;
  margin: 3%;
  height: 5em;
  width:7em;
  border-radius: 5px;
  padding: 14px 20px;
}

.chosen {
  background-color: black;
  color:white;
}

.school .themeButton{
  color:white;
}

.themeButton:hover{
  font-weight:bold;
}

.myButtons{
  width: 100%;
  height: auto;
}



h1{
  padding-top: 8vw;
  padding-bottom:5%;
}

</style>
