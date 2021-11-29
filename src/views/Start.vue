<template>
  <div v-bind:class="theme">

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
    <router-link v-bind:to="'/pollID'" tag="button">
      <button id="participateButton">
      {{uiLabels.participatePoll}}
    </button>
    </router-link>
  </div>
  </div>
</div>
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
      lang: "en",
      theme: "school"
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
    },
  }

}
</script>

<style>

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
