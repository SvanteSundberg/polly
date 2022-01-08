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
             v-on:keyup="checkID"
             v-on:keyup.enter="createPoll">
    </div>

    <div class="rightColumn">
      <button v-bind:class="['doneBtn', {notReady:this.isExisting}]"
              v-on:click="createPoll"
              v-if="this.pollId.length>0">
        {{uiLabels.Done}}
      </button>
    </div>

    <div class="unique">
      <p v-if="this.isExisting && this.pollId.length>0">
          The ID is not unique
      </p>
      <p v-else-if="this.pollId.length>0">
        The id is unique
      </p>
    </div>
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
      popupVisable: false,
      isExisting: true
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
  .position{
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    padding: 10px;
  }

  .notReady{
    background-color: grey;
    border: 1px solid grey;
  }

  .unique{
    grid-column:1;
    grid-row: 2;
  }


</style>
