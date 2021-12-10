<template>
  <div class='standard'>
  <div class= "write" v-if="done===false">
    <h1>
      {{uiLabels.writePollID}}
    </h1>
    <br>
    <input type="text" v-model="id" maxlength="15" placeholder="Type ID">

  <button class="done" v-on:click="checkPollId" v-if="this.id.length>1">
    Done
  </button>
</div>



  <div class="write" v-if="done===true && !ready">
    <h1>
      Välj namn
    </h1>
    <input type="text" v-model="userName" maxlength="15">
    <button class="done" v-on:click="sendUsername" v-if="!ready && this.userName.length>1">
    {{uiLabels.Done}}

  </button>

  </div>

  <div id="readyGo" v-if="ready">
    <h1> Get ready!</h1>
    <h2>Your username is: <span style="text-decoration:underline">{{this.userName}}</span></h2>
    <br>
  <router-link  v-bind:to="'/poll/'+id+'/'+lang" tag="button">
    <button class="done"> Lets start quizzing</button>
  </router-link>
</div>
  </div>
</template>

<script>
// v-bind:to="'/poll/'+id"
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'pollID',
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "",
      done:false,
      userName:"",
      uniqueName:false,
      ready:false
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.on('existingPolls', (existing)=>{
      this.done=existing;
      if(!existing){
        alert('Id finns ej')
      }
    } );

    socket.on('existingUsers', (existing)=>{
      this.uniqueName=existing;
      if(existing){
        alert('Namn upptaget')
      }
      else {
        this.ready=true;
      }
    } );
  },
  methods: {
    sendUsername:function(){
      socket.emit("user",{pollId:this.id, user:this.userName})
    },

    checkPollId:function(){
      socket.emit('checkPollId',this.id);
    }
  }
}
</script>

<style>
.write input{
  border-radius: 20px;
  border: white;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  outline: none;
  box-shadow: 0px 2px 2px rgba(0,0,0,0.11);

}

.write{
  margin:auto;
}

.done{
  background-color:#2ECC40;
  border: 1px solid #2ECC40;
  border-radius: 20px;
  cursor: pointer;
  color: #fff;
  text-align:  center;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left:  10px;
}

.done:hover{
  border: 1px solid #fff;

}

</style>
