<template>
  <div v-bind:class='theme'>

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
          <button class="standBtn doneBtn" v-on:click="sendUsername" v-if="this.userName.length>0">
          {{uiLabels.Done}}
        </button>
      </div>
    </div>
  </div>

  <createPopup v-on:stop="showPopup(false)"
              v-show="this.popupVisable">
  <template v-slot:header> {{uiLabels.quizzer}} </template>
  <span> {{uiLabels.nameExist}}</span>
  </createPopup>
  </div>
</template>

<script>

import createPopup from '@/components/createPopup.vue';
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'ChooseName',
  components: {createPopup},
  data: function () {
    return {
      uiLabels: {},
      id: "",
      theme:"",
      lang: "",
      userName:"",
      popupVisable: false
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    this.id=this.$route.params.id;

    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.emit("loadTheme", this.id);

    socket.on("initial", (theme) => {
      this.theme = theme;
    });

    socket.on('existingUsers', (existing)=>{
      if(existing){
        this.showPopup(true);
      }
      else {
        this.$router.replace('/poll/'+this.id+'/'+this.lang+'/'+this.userName);
      }
    });
  },

  methods: {
    sendUsername:function(){
      socket.emit("user",{pollId:this.id,
                          user:this.userName});
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
