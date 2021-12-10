<template>
  <div class='standard'>

  <label v-if="done===false">
    {{uiLabels.writePollID}}
    <input type="text" v-model="id">
    <button v-on:click="checkPollId">
      Done
    </button>
  </label>

  <label v-if="done===true">
    välj namn
    <input type="text" v-model="userName">

    <button id="createID" v-on:click="sendUsername" >
    {{uiLabels.Done}} {{this.uniqueName}}

  </button>
<router-link v-if="!uniqueName" v-bind:to="'/poll/'+id+'/'+lang" tag="button">
</router-link>
<span v-else> upptaget </span>
  </label>
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
      uniqueName:false
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
