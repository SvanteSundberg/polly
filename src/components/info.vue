<template>
  <div class="info">
<div @mouseover = "showinfo = true" @mouseleave = "showinfo = false" id="infobutton">
  <h2> i </h2>
</div>
<div v-show="showinfo" id="showhelp">
  <slot name= "helpinfo">  info </slot>
</div>
<div>
</template>

<script>
  export default {
    name: 'info',

  data: function () {
    return {
      showinfo:false,
    }
  }};
</script>

<style scoped>
.info{
  z-index:20;
}

#infobutton{
  margin-right: 0.5em;
  margin-top: 0.5em;
  padding-right:0.5em;
  padding-left: 0.5em;
  border-radius: 20%;
  opacity: 70%;
  position: absolute;
  top: 0px;
  right: 0px;
  background: white;
  color:black;
  border: 2px solid black;
}
#showhelp{
  position:absolute;
  margin-right: 2.5em;
  margin-top:1.2em;
  padding:0.5em;
  font-style:italic;
  top: 0px;
  right: 0px;
  background-color:white;
  color:black;
  border: 2px solid black;
}
@media (max-width:550px) {
  #infobutton{
    margin-top:0em;
    margin-right: 0em;
    padding-right:0.5em;
    padding-left: 0.5em;
    font-size: 70%;
  }
  #showhelp{
    margin-right: 1.8em;
    margin-top:1.2em;
    font-size: 70%;
  }

}
</style>
