<template>
  <body>

  <header>
  <h1> {{uiLabels.welcome}}</h1>
  <h3> {{uiLabels.welcomequestion}}</h3>
  </header>

  <div id="nav">
    <button id="languageButton" v-on:click="switchLanguage">{{uiLabels.changeLanguage}}</button>

    <div id="startButtons">
    <router-link v-bind:to="'/create/'+lang">
      <button id="createButton">
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
    {{uiLabels.writePollID}}
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

button{
  font-family: Average, sans-serif;
}

#startButtons button{
  font-size: 18pt;
}
#createButton:hover{
background-color:darkgreen;
}
#participateButton:hover{
background-color:darkblue;
}

#startButtons{
  padding-left: 20em;
  margin: 2em;
  display:grid;
  grid-gap: 150px;
  grid-template-columns: 100px 100px;
  align-items: center;
}

#createButton{
  height: 5em;
  width:7em;
  background-color:green;
}

#participateButton{
  height: 5em;
  width:7em;
  background-color: blue;
}
#languageButton{
  align-items: center;
}
</style>
