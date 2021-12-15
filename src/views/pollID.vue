<template>
  <div class='standard'>
  <div  v-if="done===false">
    <h1>
      {{uiLabels.writePollID}}
    </h1>
    <br>
    <div class="gridWrap">
    <div class="leftColumn">
    <input class="writeInput" type="text" v-model="id" maxlength="15" placeholder="Type ID">
    </div>
    <div class="rightColumn">
  <button class="doneBtn" v-on:click="checkPollId" v-if="this.id.length>0">
    {{uiLabels.Done}}
  </button>
</div>
</div>
</div>

  <div  v-if="done && !ready">
    <h1>
      Välj namn
    </h1>
    <br>
    <div class="gridWrap">
    <div class="leftColumn">
    <input class="writeInput" type="text" v-model="userName" maxlength="15">
  </div>
  <div class="rightColumn">
    <button class="doneBtn" v-on:click="sendUsername" v-if="!ready && this.userName.length>0">
    {{uiLabels.Done}}

  </button>
  </div>
  </div>

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
    });

    socket.on('existingUsers', (existing)=>{
      if(existing){
        alert('Namn upptaget')
      }
      else {
        this.$router.replace('/poll/'+this.id+'/'+this.lang+'/'+this.userName);
      }
    });
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



</style>
