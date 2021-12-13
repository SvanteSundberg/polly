<template>
  <div class='standard'>
<label>
  {{uiLabels.writePollID}}
  <input type="text" v-model="pollId" placeholder="Type name of the poll">
</label>
<router-link v-bind:to="'/create/'+pollId+'/'+lang">
<button>
  {{uiLabels.Done}}
</button>
</router-link>
</div>

</template>

<script>
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'EditID',
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
  }
</script>
