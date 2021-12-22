<template>
  <div v-bind:class='theme'>
    <header>
    <h1> It's time to play! </h1>
  </header>

    <div class="container">
    <span class="ID">Join with PollID: <span class="special">
    {{this.id}} </span> </span>
  </div>

  <div v-if="this.users.length>0" class="players">
    <div class="playerPicture">
      <p> {{this.users.length}} players are logged in!
        <span> <img id="figure" src='/img/streckgubbe.png'> </span>
      </p>
    </div>
  <span v-for="user in this.users" v-bind:key="user" class="cursive">
    {{user}}
  </span>
</div>
    <p v-if="this.users.length===0" class="waiting"> Waiting for players to join... </p>
 <br>

  <button v-on:click="startPoll" v-bind:class="['letsGoButton',{notReady:this.users.length === 0}]">
    Let's go
  </button>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'Waitingroom',
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "",
      theme:"",
      users:[]
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

    socket.emit('joinPoll', {pollId: this.id,
                            questionNumber: null});
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

.players span{
  padding:1em;
  padding-top:0;
  display: inline-block;
}

.special{
  font-style: italic;
  font-weight: bold;
  font-size:24pt;
}

.ID{
  background-color:LightCyan;
  padding:1em;
}

.players{
  border:dotted;
  margin:3em;
  margin-left: 15em;
  margin-right:15em;
  padding:1em;
  background-color:white;
}

.playerPicture img{
  width:50px;
  height:50px;
  position:absolute;
  top:11.5em;
  left:26em;
}

.playerPicture {
  background-color:white;
  padding:1em;
  width:11em;
  padding-right:0;
}

.waiting{
  margin-bottom:1em;
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
}

</style>
