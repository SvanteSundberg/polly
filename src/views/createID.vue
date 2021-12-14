<template>
  <div class='standard'>
<label>
  {{uiLabels.writePollID}}
  <br>
  <input type="text" v-model="pollId" :placeholder="uiLabels.typeID">
</label>
<router-link v-bind:to="'/selectTheme/'+pollId+'/'+lang">
  <br>
  <br>
<button class="buttonDone" v-on:click="createPoll">
  {{uiLabels.Done}}
</button>
</router-link>
{{this.pollId}}
</div>

</template>

<script>
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'CreateID',
  data: function () {
    return {
      lang: "",
      pollId: "",
      uiLabels: {}
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang),
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    },
    methods: {
      createPoll: function () {
        socket.emit("createPoll", {pollId: this.pollId, lang: this.lang });

      },
    },
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
