<template>
  <div v-bind:class='theme'>
    <header>

    <h1> {{uiLabels.playTime}} </h1>
  </header>

    <div class="container">
    <span class="ID">{{uiLabels.joinPollId}} <span class="special">
    {{this.id}} </span> </span>
  </div>

  <div v-if="this.users.length>0" class="players">
      <p> {{this.users.length}} {{uiLabels.loggedIn}} </p>
        <div> <img id="figure" src='/img/streckgubbe.png'> </div>
  <span v-for="user in this.users" v-bind:key="user" class="cursive">
    {{user}}
  </span>
</div>
    <p v-if="this.users.length===0" class="waiting"> {{uiLabels.waitingPlayers}} </p>
 <br>

  <button v-on:click="startPoll" v-bind:class="['letsGoButton',{notReady:this.users.length === 0}]">
    {{uiLabels.letsGo}}
  </button>

  <createPopup v-on:stop="showPopup(false)"
              v-show="this.popupVisable">
  <template v-slot:header> Quizzer </template>
  <span> At least one player must join before continuing!
  </span>
  </createPopup>

</div>
</template>

<script>
import createPopup from '@/components/createPopup.vue'
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'Waitingroom',
  components: {
    createPopup
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "",
      theme:"",
      users:[],
      popupVisable:false,
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

.container{
  margin:1em;
}

.players p{
  margin-bottom:5%;
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
  width: 100%;
  height: auto;
  color:black;
  box-shadow: 10px 5px 5px black;
}

.players{
  border:dotted;
  margin:3em;
  margin-left: 30%;
  margin-right:30%;
  padding:1%;
  background-color:white;
  color:black;
  width: auto;
  height: auto;
  justify-content: center;
}

.players img{
  width:50px;
  height:50px;
  /*position:absolute;*/
  top:20%;
  right:1%;
  margin-bottom: 5%;
}

.party .players img{
  top:10.7em;
  left:22em;
}

.playerPicture {
  background-color:white;
  padding:1em;
  width:11em;
  padding-right:0;
}

.waiting{
  margin:2.5em;
  font-size:20pt;
  font-weight: bold;
}

.letsGoButton{
   background-color:#2ECC40;
   border: 1px solid #2ECC40;
   border-radius: 56px;
   color: #fff;
   cursor: pointer;
   display: inline-block;
   /*font-family: system-ui,-apple-system,system-ui,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",sans-serif;*/
   font-size: 18px;
   font-weight: 600;
   outline: 0;
   padding: 16px 21px;
   position: relative;
   text-align: center;
   text-decoration: none;
   transition: all .3s;
   user-select: none;
   -webkit-user-select: none;
   touch-action: manipulation;
}

.letsGoButton:before {
 background-color: initial;
 background-image: linear-gradient(#fff 0, rgba(255, 255, 255, 0) 100%);
 border-radius: 125px;
 content: "";
 height: 50%;
 left: 4%;
 opacity: 1;
 position: absolute;
 top: 0;
 transition: all .3s;
 width: 92%;
}

.letsGoButton:hover {
 box-shadow: rgba(255, 255, 255, .2) 0 3px 15px inset, rgba(0, 0, 0, .1) 0 3px 5px, rgba(0, 0, 0, .1) 0 10px 13px;
 transform: scale(1.05);
}

@media (min-width: 768px) {
 .letsGoButton {
   padding: 16px 48px;
 }
}

.notReady {
  background-color: grey;
  border: 1px solid grey;
}

</style>
