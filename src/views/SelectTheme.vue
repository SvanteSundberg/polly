<template>
<div v-bind:class="theme">

  {{"Välj ditt tema"}}
<button v-on:click="setTheme('party')">party</button>
<button v-on:click="setTheme('school')">school</button>
<button v-on:click="setTheme('work')">work</button>

</div>

</template>

<script>
// v-bind:to="'/poll/'+id"
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'selectTheme',
  data: function () {
    return {
      uiLabels: {},
      theme: "start",
      //id: "",
      //lang: "en"
    }
  },
  created: function () {
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },

  methods: {
    setTheme: function (theme) {
      this.theme=theme;
      console.log(this.theme);
    }

  }
}
</script>
