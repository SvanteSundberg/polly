<template>

<body>
  <header>
  <h1> {{uiLabels.welcome}}</h1>
  <h3> {{uiLabels.welcomequestion}}</h3>
  </header>

  <div id="nav">
    <button v-on:click="switchLanguage">{{uiLabels.changeLanguage}}</button>

    <div id="startButtons">
    <router-link v-bind:to="'/create/'+lang">
      <button id='createButton'>
        {{uiLabels.createPoll}}
        </button>
    </router-link>
    <router-link v-bind:to="'/poll/'+id" tag="button">
      <button id="participateButton">
      {{uiLabels.participatePoll}}
    </button>
    </router-link>
  </div>

  <label>
    Write poll id:
    <input type="text" v-model="id">
  </label>
  </div>

</body>
</template>

<script>
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Start',
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "en"
    }
  },
  created: function () {
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
  methods: {
    switchLanguage: function() {
      if (this.lang === "en")
        this.lang = "sv"
      else
        this.lang = "en"
      socket.emit("switchLanguage", this.lang)
    }
  }
}
</script>

<style>
@import 'https://fonts.googleapis.com/css?family=Average';
body {
   font-family: Average, sans-serif;
   font-size: 14pt;
}

#startButtons{
  display:grid;
  grid-gap: 10px;
  grid-template-columns: 500px 500px;
}
</style>
