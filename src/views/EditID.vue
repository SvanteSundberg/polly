<template>
  <div class='standard'>
    <div class='position'>
    <h1>{{uiLabels.writePollID}}
    </h1>
      <br>

  <div class="gridWrap">
    <div class="leftColumn">
      <div class="tryPosition">
      <input type="text"
             v-model="pollId"
             :placeholder="uiLabels.typeID"
             v-on:keyup.enter="checkID"
             v-on:keyup="searchName"
             v-bind:class="['writeInput',{resultShow:this.pollId.length>0}]">


       <div class="results"
            v-bind:class="[{allResults:this.pollId.length>0}]">
       <div v-if="this.pollId.length>0 && this.included.length>0">
         <button v-for="(poll,i) in included"
              v-bind:key="i"
              v-on:click="goToPoll(i)">
           {{poll}} <br>
         </button>
       </div>

       <p v-else-if="this.pollId.length>0 && this.included<1">
         No results found
       </p>
    </div>
  </div>
  </div>

    <div class="rightColumn">
      <button class="doneBtn"
              v-on:click="checkID"
              v-if="this.pollId.length>0">
        {{uiLabels.Done}}
      </button>
    </div>
  </div>

  </div>


<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> Quizzer </template>
<span> ID does not exist </span>
</createPopup>
</div>

</template>

<script>
import createPopup from '@/components/createPopup.vue';
import io from 'socket.io-client';
const socket = io();
export default {
  name: 'EditID',
  components:{
    createPopup,
  },
  data: function () {
    return {
      lang: "",
      pollId: "",
      uiLabels: {},
      unique: true,
      popupVisable:false,
      polls:[],
      included:[]
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang),
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.on('existingPolls', (existing)=>{
      if (existing){
        this.$router.replace('/create/'+this.pollId+'/'+this.lang);
      }
      else{
        this.showPopup(true);
      }
    });
    socket.emit("getPolls");

    socket.on("allPolls", (polls) => {
      this.polls=polls;
      this.included=[];
    });

    },
    methods: {
      checkID: function(){
        if (this.pollId.length>0){
          socket.emit('checkPollId', this.pollId);
        }
        else{
          this.showPopup(true);
        }
      },
      showPopup:function(value){
        this.popupVisable=value;
      },

      searchName: function(){
        if (this.pollId.length>0 && this.polls.length>0){
          for (let i=0; i<this.polls.length;i++){
            let specificPoll = this.polls[i];
            let lowerPoll = specificPoll.toLowerCase();
            let lowerName = this.pollId.toLowerCase();
              if (lowerPoll.includes(lowerName) &&
                  !this.included.includes(specificPoll)){
                this.included.push(specificPoll);
              }
              else if (!lowerPoll.includes(lowerName) &&
                  this.included.includes(specificPoll)){
                this.included.splice(this.polls.indexOf(specificPoll))
              }
          }
      }
      else{
        this.included=[];
      }
      },

      goToPoll:function(index){
        const poll=this.included[index];
        this.$router.replace('/create/'+ poll +'/'+this.lang);
      }
    }
  }
</script>

<style scoped>
  .position{
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    padding: 10px;
  }

  .search{
    margin-top:2em;
  }

  .results button{
    display:flex;
    flex-direction: column;
    background-color:white;
    border:white;
    width: 12.3em;
    height:2em;
    padding:0.5em;
    grid-row:2;
  }

  .results button:hover{
    background-color:black;
    color:white;
  }

  .results p{
    background-color:white;
    border:white;
    width: 9.6em;
    height:1.2em;
    padding:0.2em;
    grid-row:2;
  }

  .allResults{
    box-shadow: 2px 2px 10px grey;
    grid-row:2;
  }

  .resultShow{
    border-radius: 0;
    border-bottom: 1px solid black;
  }

  .tryPosition{
    position:absolute;
    left:1em;
    top:4em;
  }

</style>
