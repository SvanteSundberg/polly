<template>
  <div v-bind:class='theme'>
    <h3> Time to join! </h3>
    Pollid: {{this.id}}
    <!-- QR-KOD-->
    <p> Waiting for players to join! </p>

  <div v-for="user in this.users" v-bind:key="user">
    {{user}}
  </div>

  <p> Amount users: {{this.users.length}} </p>

  <button  v-on:click="startPoll" v-bind:class="['letsGoButton',{notReady:this.users.length === 0}]">
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
    }

  },
}
</script>

<style scoped>
.letsGoButton{
background-color:green;
 border: 0;
 border-radius: 56px;
 color: #fff;
 cursor: pointer;
 display: inline-block;
 font-family: system-ui,-apple-system,system-ui,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",sans-serif;
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
