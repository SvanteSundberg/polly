<template>
  <div class='standard'>
    <div class='position'>
    <h1>{{uiLabels.writePollID}}
    </h1>
      <br>

  <div class="gridWrap">
    <div class="leftColumn">
      <input class="writeInput"
             type="text"
             v-model="pollId"
             :placeholder="uiLabels.typeID"
             v-on:keyup.enter="checkID">
    </div>

    <div class="rightColumn">
      <button class="doneBtn"
              v-on:click="checkID"
              v-if="this.pollId.length>0">
        {{uiLabels.Done}}
      </button>
    </div>
  </div>

  </div>


<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> Quizzer </template>
<span> ID does not exist </span>
</createPopup>
</div>

</template>

<script>
import createPopup from '@/components/createPopup.vue';
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'EditID',
  components:{
    createPopup
  },
  data: function () {
    return {
      lang: "",
      pollId: "",
      uiLabels: {},
      unique: true,
      popupVisable:false
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
        this.$router.replace('/create/'+this.pollId+'/'+this.lang);
      }
      else{
        this.showPopup(true);
      }
    });
    },
    methods: {
      checkID: function(){
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

<style scoped>
  .position{
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    padding: 10px;
  }

</style>
