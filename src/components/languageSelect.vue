<template v-on:click="closeDropdown">
  <div class="dropdown">
    <button id="languageMenu" v-on:click="showDropdown">
      <img id="langLogo" src="https://www.pngitem.com/pimgs/m/31-311919_languages-icon-png-free-transparent-png.png">
       {{uiLabels.Language}}
     </button>
    <div class="dropdown-content" v-if="dropdownVisable">
    <button v-on:click="selectSv"
            v-bind:class="['selected',{notSelected:this.english === true}]">
            sv
    </button>
    <button v-on:click="selectEn"
            v-bind:class="['selected',{notSelected:this.english === false}]">
            en
    </button>
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
      uiLabels: {},
      lang:"en",
      dropdownVisable:false,
      english:true
    }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
  },
  methods: {
    selectSv: function () {
      this.english=false;
      this.$emit("SV");
    },

    selectEn: function () {
      this.english=true;
      this.$emit("EN");
    },

    showDropdown:function(){
      this.dropdownVisable=!this.dropdownVisable;
    },

    closeDropdown:function(){
      this.dropdownVisable=false;
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
  /*border:solid 1px black;*/
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}
.dropdown-content button:hover{
  border:solid 1px white;
}

 .dropdown-content {
  display: flex;
  flex-direction: column;
}

.selected{
border:solid 1px white;
}

.notSelected{
  border:solid 1px black;
}

#langLogo{
  float:right;
  width: 15px;
  padding-left: 5px;
}
#languageMenu{
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #fff;
  font-size: 11pt;
  padding: 0.1em 0.2em;
  cursor: pointer;
}

#languageMenu:hover{
  border: 1px solid #00A6FF;
}

</style>
