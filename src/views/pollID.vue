<template>
  <div class='standard'>
    <div  v-if="!done">
    <div class='position'>
    <h1>
      {{uiLabels.writePollID}}
    </h1>
    <br>
  <div class="gridWrap">
    <div class="leftColumn">
    <input class="writeInput"
            type="text"
            v-model="id"
            maxlength="15"
            placeholder="Type ID"
            v-on:keyup.enter="checkPollId">
    </div>
    <div class="rightColumn">
  <button class="doneBtn" v-on:click="checkPollId" v-if="this.id.length>0">
    {{uiLabels.Done}}
  </button>
  </div>
</div>
</div>

<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> Quizzer </template>
<span> Poll does not exists </span>
</createPopup>
</div>

<div  v-if="done && !ready">
<div class='position'>
    <h1>
      {{uiLabels.chooseName}}:
    </h1>
    <br>
    <div class="gridWrap">
    <div class="leftColumn">
    <input class="writeInput"
           type="text"
           v-model="userName"
           maxlength="15"
           v-on:keyup.enter="sendUsername">
  </div>

  <div class="rightColumn">
    <button class="doneBtn" v-on:click="sendUsername" v-if="!ready && this.userName.length>0">
    {{uiLabels.Done}}
  </button>
  </div>
  </div>
  </div>
  <createPopup v-on:stop="showPopup(false)"
              v-show="this.popupVisable">
  <template v-slot:header> Quizzer </template>
  <span> Name already exists </span>
  </createPopup>
  </div>
  </div>
</template>

<script>
// v-bind:to="'/poll/'+id"
import createPopup from '@/components/createPopup.vue';
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'pollID',
  components: {createPopup},
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "",
      done:false,
      userName:"",
      ready:false,
      popupVisable: false
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
        this.showPopup(true);
        /*alert('Id finns ej')*/
      }
    });

    socket.on('existingUsers', (existing)=>{
      if(existing){
        this.showPopup(true);
      /*  alert('Namn upptaget')*/
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
    },

    showPopup:function(value){
      this.popupVisable=value;
    }
  }
}
</script>

<style scoped>
  .position{
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    padding: 10px;
  }


</style>
