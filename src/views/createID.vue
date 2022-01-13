<template>
  <div class='standard'>
    <div class='position'>
    <h1>{{uiLabels.writePollID}}</h1>
  <br>
  <div class="gridWrap">
    <div class="leftColumn">
      <input class="writeInput"
             type="text"
             v-model="pollId"
             :placeholder="uiLabels.typeID"
             maxlength="15"
             v-on:keyup="checkID"
             v-on:keyup.enter="createPoll">
    </div>

    <div class="rightColumn">
      <button v-bind:class="['standBtn doneBtn', {notReady:this.isExisting}]"
              v-on:click="createPoll"
              v-if="this.pollId.length>0">
        {{uiLabels.Done}}
      </button>
    </div>
  </div>

  <div
     v-bind:class="['unique',{notUnique:this.isExisting && this.pollId.length>0}]">
        {{uiLabels.idExists}}

  </div>

  </div>

  <createPopup v-on:stop="showPopup(false)"
              v-show="this.popupVisable">
  <template v-slot:header> {{uiLabels.quizzer}} </template>
  <span> {{uiLabels.idExists}}</span>
  </createPopup>

</div>

<div class="infodiv">
  <info>
    <template v-slot:helpinfo> {{uiLabels.infoCreateID}} </template>
  </info>
</div>

</template>

<script>
import createPopup from '@/components/createPopup.vue';
import io from 'socket.io-client';
import info from '@/components/info.vue';
const socket = io();
export default {
  name: 'CreateID',
  components: {
    createPopup,
    info,
  },

  data: function () {
    return {
      lang: "",
      pollId: "",
      uiLabels: {},
      popupVisable: false,
      isExisting: false
    }
  },

  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang),
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.on('existingPolls', (existing)=>{
      this.isExisting=existing;
    });
    },

    methods: {
      createPoll: function(){
        if (!this.isExisting && this.pollId.length>0){
          socket.emit("createPoll", {pollId: this.pollId, lang: this.lang });
          this.$router.replace('/selectTheme/'+this.pollId+'/'+this.lang);
        }
        else{
          this.showPopup(true);
        }
      },

      checkID(){
        if (this.pollId.length>0){
          socket.emit('checkPollId', this.pollId);
        }
      },

      showPopup:function(value){
        this.popupVisable=value;
      },

  }
  }
</script>

<style scoped>

@import url("/styleID.css");

  .notReady{
    background-color: grey;
    border: 1px solid grey;
  }

  .unique{
    color:transparent;
    margin-top:5%;
  }

  .notUnique{
    color:black;
  }


</style>
