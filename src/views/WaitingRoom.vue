<template>
  <div v-bind:class='theme'>
    <header>

    <h1> {{uiLabels.playTime}} </h1>
  </header>

  <div class="container">
    <span class="ID">{{uiLabels.joinPollId}} <span class="special">
    {{this.id}} </span>
     {{uiLabels.scanQR}}:</span>

    <div class="qrCode">
    <qrcode-vue :value="'https://quizmadness.herokuapp.com/#/chooseName/'+this.id+'/'+this.lang" :size="size" level="H" />
  </div>
    </div>

  <div v-if="this.users.length>0" class="players">
      <p> {{this.users.length}} {{uiLabels.loggedIn}} </p>
  <span v-for="user in this.users" v-bind:key="user" class="cursive">
    {{user}}
  </span>
</div>

    <p v-if="this.users.length===0" class="waiting"> {{uiLabels.waitingPlayers}} </p>

  <button v-on:click="startPoll" v-bind:class="['standBtn doneBtn',{notReady:this.users.length === 0}]">
    {{uiLabels.letsGo}}
  </button>

  <createPopup v-on:stop="showPopup(false)"
              v-show="this.popupVisable">
  <template v-slot:header> {{uiLabels.quizzer}} </template>
  <span> {{uiLabels.onePlayer}}
  </span>
  </createPopup>
</div>
<info>
  <template v-slot:helpinfo>{{uiLabels.infoWaitingRoom}}</template>
</info>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import info from '@/components/info.vue';
import createPopup from '@/components/createPopup.vue'
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'Waitingroom',
  components: {
    createPopup,
    QrcodeVue,
      info,
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "",
      theme:"",
      users:[],
      popupVisable:false,
      value: 'https://quizmadness.herokuapp.com/#/chooseName/'+this.id+'/'+this.lang,
      size: 110,
    }
  },
  created: function () {
    this.id=this.$route.params.id;
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.emit("loadTheme",this.id);
    socket.on("initial", (theme) => {
      this.theme = theme
    });

    socket.emit("getUserAmount", this.id);

    socket.on("userAmount",(userAmount) => {
      this.users=userAmount;
    });

    socket.emit('joinPoll', this.id);
    socket.on("allUsers", (users) => {
      console.log("tar emot users");
      this.users = users;
    });
  },

  methods: {
    startPoll: function(){
      if (this.users.length>0){
        socket.emit("timeToStart", this.id);
        this.$router.replace('/creatorPoll/'+this.id+'/'+this.lang);
      }
      else{
        this.popupVisable=true;
      }
    },

    showPopup:function(value){
      this.popupVisable=value;
    },

  },
}
</script>

<style scoped>

header{
  padding:1em;
}

.doneBtn{
    font-size:16pt;
    padding:2vh;
    padding-right:3vh;
    padding-left:3vh;
    border-radius: 50px;
}

.players p{
  margin-bottom:2%;
}
.players span{
  display: inline-block;
  margin-left:5%;
}

.special{
  font-style: italic;
  font-weight: bold;
  font-size:24pt;
}

.ID{
  background-color:white;
  padding:1%;
  width: 20%;
  height: 20%;;
  color:black;
  box-shadow: 10px 5px 5px black;
  border-radius: 20px;
}

.players{
  border:1px solid;
  margin-top:1em;
  margin-bottom:1vh;
  margin-left: 20%;
  margin-right:20%;
  padding:1%;
  background-color:white;
  color:black;
  min-height: 20vh;
  height: auto;
  text-align:center;
  border-radius:20px;
}

.players p{
  margin:2vh;
}


.qrCode{
  position:relative;
  top:0.5em;
  margin:1em;
}

.waiting{
  margin-bottom:8vh;
  margin-top:5%;
  font-size:20pt;
  font-weight: bold;
  text-align:center;
}

.notReady {
  background-color: grey;
  border: 1px solid grey;
}

.container{
  margin-top:2%;
}

</style>
