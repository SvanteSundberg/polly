<template>
  <div class='standard'>
  <header>
  <h1> {{uiLabels.welcome}}</h1>
  <h3> {{uiLabels.welcomequestion}}</h3>
  </header>

  <div id="nav">
    <div id="languageDiv">
    <button id="languageButton" v-on:click="switchLanguage">
      <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Ffreeicons.io%2Fsummer-icons%2Flanguages-chat-icon-1245&psig=AOvVaw1XzVH0bJwhLjs51eRQeeqB&ust=1639150943784000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOjBsaCH1_QCFQAAAAAdAAAAABAD" style= "width: 5px;">
      {{uiLabels.changeLanguage}}</button>
  </div>
    <div id="startButtons">
    <router-link v-bind:to="'/createID/'+lang">
      <button id="createButton">
        {{uiLabels.createPoll}}
        </button>
    </router-link>
    <router-link v-bind:to="'/pollID/'+lang" tag="button">
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

<style scoped>

#startButtons button{
  /*font-size: 18pt;
  height: 5em;
  width:7em;
  box-shadow: 10px 10px 10px 10px black;*/
border-radius: 5px;
font-size: 20px;
padding: 14px 20px;
cursor: pointer;
color: #fff;
text-align:  center;
font-size: 1.5rem;
font-family: 'Roboto';
font-weight: 100;
box-shadow: 2px 2px 20px gray;
transition-duration: 0.5s;
-webkit-transition-duration: 0.1s;
-moz-transition-duration: 0.1s;
}
#createButton:hover{
  border: 1px solid #fff;
  box-shadow: 2px 2px 20px #AFE9FF;
}
#participateButton:hover{
  border: 1px solid #fff;
  box-shadow: 2px 2px 20px #AFE9FF;
}

#startButtons{

  justify-content: center;
  display:grid;
  grid-gap: 150px;
  grid-template-columns: 7em 7em;
  align-items: center;
}

#createButton{
  background-color:#2ECC40;
  width: 200px;
  height: 70px;
  border: 1px solid #2ECC40;
}

#participateButton{
  background-color: #00A6FF;
  width: 200px;
  height: 70px;
  border: 1px solid #00A6FF;
}
#languageButton{
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #fff;
  font-size: 11pt;
  padding: 0.1em 0.2em;
  cursor: pointer;
  text-align:  center;
  transition-duration: 0.5s;
  -webkit-transition-duration: 0.1s;
  -moz-transition-duration: 0.1s;
}

#languageButton:hover{
  border: 1px solid black;


}
#languageDiv{
  margin:10px;
  margin-bottom: 50px;
  justify-content: center;

}

h1{
  padding-top:1em;
}
</style>
