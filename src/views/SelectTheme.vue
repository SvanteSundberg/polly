<template>
<div v-bind:class="theme">

  {{"Välj ditt tema"}}
<button v-on:click="setTheme('party')">party</button>
<button v-on:click="setTheme('school')">school</button>
<button v-on:click="setTheme('work')">work</button>
<router-link v-bind:to="'/create/'+id+'/'+lang">

<button v-on:click="chooseTheme()">Välj det här temat</button>
</router-link>
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
      theme: "standard",
      id: "",
      lang: ""
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },

  methods: {
    setTheme: function (theme) {
      this.theme=theme;
      console.log(this.theme);
    },

    chooseTheme: function(){
      this.id=this.$route.params.id;
      console.log(this.id);
      socket.emit("chooseTheme", {pollId: this.id, theme: this.theme})
    }

  }
}
</script>
