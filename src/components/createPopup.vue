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
        <button class="standBtn addBtn" v-on:click="ok">
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
    flex-direction: column;
    color:black;
    padding:2em;
    z-index:10;
  }

  .popup {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    border-radius: 10px;
    color:black;
    padding:0.5em;
  }

  .popupBody{
    padding: 3%;
  }

  .popupHeader {
    padding: 3%;
    position: relative;
    color: black;
    justify-content: space-between;
    border-bottom: 1px solid;
  }

  .popupFooter {
    position: relative;
    font-size: 10pt;
  }

</style>
