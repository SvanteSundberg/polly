<template>
  <div class="popupBackground">
      <div class="popup">
        <header class="popupHeader">
          Waiting for host
        </header>
        <section class="popupBody">
          <div class="loading"></div>
       </section>
      <footer class="popupFooter">
          The host is preparing next question...
      </footer>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'pollPopup',
  };
</script>

<style>
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
  }

  .popup {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .popupHeader {
    padding: 15px;
    display: flex;
    margin: auto;
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: black;
    justify-content: space-between;
  }

  .popupBody {
    justify-content: center;
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    border-bottom: 1px solid #eeeeee;
  }

  .popupFooter {
    display: flex;
    margin: auto;
    position: relative;
    padding: 20px 10px;
    font-size: 10pt;
  }

  .loading{
    display:flex;
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: auto;
    width: 20px;
    height: 20px;
    background-color: darkgray;
    border-radius: 50%;
    position: relative;
    /*border:solid 5px darkgrey;*/
    animation: loadingMove 2s infinite;
  }

  @keyframes loadingMove {
    0%   {left: 0px;opacity:1;  }
    25% {opacity:0.5;}
    50%  {opacity:1;}
    75% {opacity:0.5;}
    100% {left: 180px;opacity:1;  }
    }

</style>
