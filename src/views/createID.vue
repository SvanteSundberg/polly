<template>
  <div class='standard'>
<label>
  {{uiLabels.writePollID}}
  <br>
  <input type="text" v-model="pollId" :placeholder="uiLabels.typeID">
</label>

<button class="done" v-on:click="checkID">
  {{uiLabels.Done}}
</button>

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
.buttonDone{
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

.buttonDone:hover{
  border: 1px solid #fff;
}

</style>
