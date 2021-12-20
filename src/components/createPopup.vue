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
        <button class="doneBtn" v-on:click="ok">
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
  }

  .popup section{
    padding:15px;
    padding-left: 30px;
    padding-right:30px;
    align-items: left;
  }

  .popupHeader {
    padding: 15px;
    position: relative;
    color: black;
    justify-content: space-between;
    border-bottom: 1px solid;
  }

  .popupFooter {
    position: relative;
    padding: 20px 10px;
    font-size: 10pt;
  }

</style>
