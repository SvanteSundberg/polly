<template>
  <div class="popupBackground">
      <div class="popup">
        <header class="popupHeader">
          <slot name="header"></slot>
        </header>
        <section class="popupBody">
          <slot></slot>
       </section>
      <footer class="popupFooter">
        <button class="standBtn doneBtn" v-on:click="ok">
          <slot name="button">OK</slot>
        </button>
      </footer>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'createPopup',
    methods: {
      ok: function () {
        this.$emit("stop");
      }
    }
  }
</script>

<style scoped>
.popupBackground {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    color:black;
    font-family: 'Roboto', sans-serif;
  }

  .popup {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    color:black;
    width:450px;
    height: 350px;
  }

  .popup section{
    padding:5%;
    padding-left: 3%;
    padding-right:3%;
    align-items: left;
  }

  .popupHeader {
    padding: 5%;
    position: relative;
    color: black;
    justify-content: space-between;
    border-bottom: 1px solid;
  }

  .popupFooter {
    position: relative;
    padding: 2% 1%;
    font-size: 10pt;
  }

  @media (max-width: 550px) {
    .popup { font-size: 15px;
              width:200px;
              height: 300px;}
  }

</style>
