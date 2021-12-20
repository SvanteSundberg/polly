<template>
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
</template>

<script>
import io from 'socket.io-client';
import languageSelect from '@/components/languageSelect.vue'
const socket = io();

export default {
  name: 'Start',
  components: {
    languageSelect
  },
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
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 350px 350px 350px;
  margin-top:3em;
  margin-bottom: 3em;
  justify-content: center;
}

.startButtons button{
  border-radius: 5px;
  padding: 0.5em;
  color: #fff;
  text-align:  center;
  font-size: 1.5rem;
  font-weight: 100;
  box-shadow: 2px 2px 20px gray;
  border: 1px solid black;
  background: DarkSlateGrey;
  width: 200px;
  height: 90px;
  justify-content: center;
  /* transition-duration: 0.5s;
  -webkit-transition-duration: 0.1s;
  -moz-transition-duration: 0.1s;*/
}

#createButton:hover{
  border: 1px solid #fff;
  box-shadow: 2px 2px 20px #AFE9FF;
  background-color: lightblue;
}
#participateButton:hover{
  border: 1px solid #fff;
  box-shadow: 2px 2px 20px #AFE9FF;
  background-color: lightblue;
}
#editButton:hover{
  border: 1px solid #fff;
  box-shadow: 2px 2px 20px #AFE9FF;
  background-color: lightblue;
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
  padding-top:1em;
  text-shadow: 4px 4px 5px white;
  margin-bottom:0.5em;
}

</style>
