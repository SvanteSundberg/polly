<template>
  <div class="dropdown">
    <div id="languageMenu"> select language</div>
    <div class="dropdown-content">
    <button v-on:click="selectSv">sv</button>
    <button v-on:click="selectEn">en</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io();

export default {


  name: 'languageSelect',
  data: function () {
    return {
      lang:""
    }
  },
    created: function () {

    },
  methods: {

selectSv:function(){
  this.lang="sv";
  socket.emit("switchLanguage", this.lang)
},

selectEn:function(){
  this.lang="en";
  socket.emit("switchLanguage", this.lang)
}
}
}
</script>
<style>

#languageMenu{
  font-size: 10pt;
  padding:5px;
  border-radius: 5px;
  border:solid 1px white;
}



.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;

  min-width: 40px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 12px 16px;
}

.dropdown-content button{
  background-color: #98B4D4;
  width: 40px;
  height: 40px;
  padding:10px;
  margin:5px;
  justify-content: center;
  border:solid 1px black;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}
.dropdown-content button:hover{
  border:solid 1px white;
}

.dropdown:hover .dropdown-content {
  display: flex;
  flex-direction: column;
}

</style>
