<template>
  <div class='standard'>
    <info>
      <template v-slot:helpinfo> här sätter du in hjälplabel </template>
    </info>
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
                v-on:keyup.enter="checkJoinable">
        </div>
        <div class="rightColumn">
      <button class="standBtn doneBtn"
              v-on:click="checkJoinable"
              v-if="this.id.length>0">
        {{uiLabels.Done}}
      </button>
        </div>
      </div>
    </div>

<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> {{uiLabels.quizzer}} </template>
<span>{{uiLabels.idnotExist}}{{uiLabels.canjoin}}</span>
</createPopup>

  </div>

</template>

<script>
// v-bind:to="'/poll/'+id"
import createPopup from '@/components/createPopup.vue';
import io from 'socket.io-client';
import info from '@/components/info.vue';
const socket = io();
export default {
  name: 'pollID',

  components: {createPopup,
  info,
},

  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "",
      popupVisable: false,
      canJoin: false,
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.on('join', (canJoin)=>{
      if(canJoin){
        this.$router.replace('/chooseName/'+this.id+'/'+this.lang);
      }
      else{
        this.showPopup(true);
      }
    });

  },
  methods: {
    checkJoinable:function(){
      socket.emit('isJoin', this.id);
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
