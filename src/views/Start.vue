<template>
  <head>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">
</head>
  <div class='standard'>
  <header>
  <h1> {{uiLabels.welcome}}</h1>
  <h3> {{uiLabels.welcomequestion}}</h3>
  </header>

  <div id="nav">
    <div class="startButtons" id="startButtons">
    <router-link v-bind:to="'/createID/'+lang">
      <button id="createButton">
        {{uiLabels.createPoll}}
        </button>
    </router-link>

    <router-link v-bind:to="'/editID/'+lang">
      <button id="editButton">
        {{uiLabels.editPoll}}
        </button>
    </router-link>

    <router-link v-bind:to="'/pollID/'+lang" tag="button">
      <button id="participateButton">
      {{uiLabels.participatePoll}}
    </button>
    </router-link>
</div>
  <languageSelect v-on:SV="selectSv"
                  v-on:EN="selectEn"
                  v-bind:uiLabels="uiLabels">
  </languageSelect>
  </div>
</div>
<info>
  <template v-slot:helpinfo>{{uiLabels.infoStart}}</template>
</info>
</template>

<script>
import io from 'socket.io-client';
import languageSelect from '@/components/languageSelect.vue';
import info from '@/components/info.vue';
const socket = io();

export default {
  name: 'Start',
  components: {
    languageSelect,
    info,
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "en",
    }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
  methods: {
    selectSv:function(){
      this.lang="sv";
      socket.emit("switchLanguage", this.lang)
    },

    selectEn:function(){
      this.lang="en";
      socket.emit("switchLanguage", this.lang)
    }
  }

}
</script>

<style scoped>

.startButtons {
  display: flex;
  flex-wrap:wrap;
  margin-top:7%;
  justify-content: center;
}

.startButtons button{
  border-radius: 10px;
  padding: 5%;
  color: #fff;
  text-align:  center;
  font-size: 1.3em;
  font-weight: 100;
  box-shadow: 2px 2px 20px black;
  border: 1px solid black;
  background-color: #7EBDE5;
  width: 7em;
  height: 3.5em;
  justify-content: center;
  margin-left:2.5vw;
  margin-right:2.5vw;
  margin-bottom:4vw;
}

#createButton{
  grid-column: 1;
}

#participateButton{
  grid-column:3;
}

#editButton{
  grid-column:2;
}

#languageButton{
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #fff;
  font-size: 11pt;
  padding: 0.1em 0.2em;
  cursor: pointer;
  text-align: center;
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

#languageLogo{
  float:right;
  width: 15px;
  padding-left: 5px;
}

h1{
  padding-top:7%;
  text-shadow: 4px 4px 5px white;
  margin-bottom:2vh;
}

</style>
