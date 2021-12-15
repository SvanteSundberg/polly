<template>
  <div class='standard'>
    
    <h1>{{uiLabels.writePollID}}</h1>
  <br>
  <div class="gridWrap">
  <div class="leftColumn">
  <input class="writeInput" type="text" v-model="pollId" :placeholder="uiLabels.typeID">
</div>
<div class="rightColumn">
<button class="doneBtn" v-on:click="checkID" v-if="this.pollId.length>0">
  {{uiLabels.Done}}
</button>
</div>
</div>

<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> Quizzer </template>
<span> ID already exists </span>
</createPopup>

</div>

</template>

<script>
import createPopup from '@/components/createPopup.vue';
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'CreateID',
  components: {
    createPopup
  },
  data: function () {
    return {
      lang: "",
      pollId: "",
      uiLabels: {},
      popupVisable: false
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang),
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.on('existingPolls', (existing)=>{
      if (existing){
        this.showPopup(true);
      }
      else{
        socket.emit("createPoll", {pollId: this.pollId, lang: this.lang });
        this.$router.replace('/selectTheme/'+this.pollId+'/'+this.lang);
      }
    });
    },

    methods: {
      checkID: function(){
        console.log("checking");
        if (this.pollId.length>0){
          socket.emit('checkPollId', this.pollId);
        }
        else{
          this.showPopup(true);
        }
      },
      showPopup:function(value){
        this.popupVisable=value;
      },

  }
  }
</script>


<style>


</style>
