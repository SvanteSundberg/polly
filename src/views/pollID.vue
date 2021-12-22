<template>
  <div class='standard'>
    <div class='position'>
  <div  v-if="!done">
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

<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> Quizzer </template>
<span> ID does not exists </span>
</createPopup>
</div>

<div class='position'>
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
  <createPopup v-on:stop="showPopup(false)"
              v-show="this.popupVisable">
  <template v-slot:header> Quizzer </template>
  <span> Name already exists </span>
  <!--<template v-slot:button> Quizzer </template>-->
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

<style>
  .position{
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    padding: 10px;
  }


</style>
