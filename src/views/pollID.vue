<template>
  <div class='standard'>
    <div class='position'>
    <h1>
      {{uiLabels.joinQuizname}}
    </h1>
    <br>
      <div class="gridWrap">
        <div class="leftColumn">
        <input class="writeInput"
                type="text"
                v-model="id"
                maxlength="15"
                 :placeholder="uiLabels.typeID"
                v-on:keyup.enter="checkPollId">
        </div>
        <div class="rightColumn">
      <button class="standBtn doneBtn" v-on:click="checkPollId" v-if="this.id.length>0">
        {{uiLabels.Done}}
      </button>
        </div>
      </div>
    </div>

<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> {{uiLabels.quizzer}} </template>
<span>{{uiLabels.idnotExist}}</span>
</createPopup>

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
      if(existing){
        this.$router.replace('/chooseName/'+this.id+'/'+this.lang);
      }
      else{
        this.showPopup(true);
      }
    });

  },
  methods: {
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
@import url("/styleID.css");

</style>
