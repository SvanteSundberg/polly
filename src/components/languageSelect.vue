<template v-on:click="closeDropdown">
  <div class="dropdown">
    <div class="languageMenu">
    <button  v-on:click="showDropdown" v-bind:class="['notClicked',{clicked:this.dropdownVisable === true}]">
      <img id="langLogo" src="https://www.pngitem.com/pimgs/m/31-311919_languages-icon-png-free-transparent-png.png">
       {{uiLabels.Language}}
     </button>
   </div>
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
export default {
  name: 'languageSelect',
  props:{
    uiLabels: Object
  },
  data: function () {
    return {
      lang:"en",
      dropdownVisable:false,
      english:true
    }
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
<style scoped>

.languageMenu{
  font-size: 10pt;
  padding:5px;
  border-radius: 5px;

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
  width: 40px;
  height: 25px;
  margin:5px;
  justify-content: center;
  /*border:solid 1px black;*/
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  border-radius: 10px;
}
.dropdown-content button:hover{
  border:solid 1px #3B3B3B;
  background-color: #3B3B3B;
  color: #fff;
}

 .dropdown-content {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}

.selected{
  border:solid 1px #3B3B3B;
  background-color: #3B3B3B;
  color: #fff;
}

.notSelected{
  background-color: transparent;
  border:solid 1px #3B3B3B;
  color:black;
}

#langLogo{
  float:right;
  width: 15px;
  padding-left: 5px;
}
.notClicked{
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #fff;
  font-size: 11pt;
  padding: 0.1em 0.2em;
  cursor: pointer;
}

.languageMenu button:hover{
  border: 1px solid #3B3B3B;
}
.clicked {
  background-color: lightgray;
  align-items: center;
  border-radius: 10px;
  border: 1px solid lightgray;
  font-size: 11pt;
  padding: 0.1em 0.2em;
  cursor: pointer;
}

#languageMenu::after{
  background-color: gray;
}

</style>
