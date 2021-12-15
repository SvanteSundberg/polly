<template>
  <div class='standard'>
<label>
  {{uiLabels.writePollID}}
  <input type="text" v-on:change="checkID" v-model="pollId" placeholder="Type name of the poll">
</label>

<router-link v-if="!unique" v-bind:to="'/create/'+pollId+'/'+lang">
<button>
  {{uiLabels.Done}}
</button>
</router-link>

<button v-if="unique" v-on:click="showPopup(true)">
  {{uiLabels.Done}}
</button>

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
      this.unique= !existing;
    });
    },
    methods: {
      checkID: function(){
        if (this.pollId.length>0){
          socket.emit('checkPollId', this.pollId);
        }
        else{
          this.unique=true;
        }
      },
      showPopup:function(value){
        this.popupVisable=value;
      },
    }
  }
</script>
