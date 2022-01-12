<template>
  <div class='standard'>
    <div class='position edit'>
    <h1>{{uiLabels.editQuizname}}
    </h1>
      <br>

  <div class="gridWrap">
    <div class="leftColumn">
      <div class="tryPosition">
      <input type="text"
             v-model="pollId"
             :placeholder="uiLabels.typeID"
             maxlength="15"
             v-on:keyup.enter="checkID"
             v-on:keyup="searchName"
             v-bind:class="['writeInput',{resultShow:this.pollId.length>0}]">


       <div class="results">
       <div class="showResults" v-if="this.pollId.length>0 && this.included.length>0">
         <button v-for="(poll,i) in included"
              v-bind:key="i"
              v-on:click="goToPoll(i)">
           {{poll}} <br>
         </button>
       </div>

       <p v-else-if="this.pollId.length>0 && this.included<1">
         {{uiLabels.noPolls}}
       </p>
    </div>

  </div>
  </div>

    <div class="rightColumn">
      <button class="standBtn doneBtn"
              v-on:click="checkID"
              v-if="this.pollId.length>0">
        {{uiLabels.Done}}
      </button>
    </div>
  </div>

  </div>


<createPopup v-on:stop="showPopup(false)"
            v-show="this.popupVisable">
<template v-slot:header> {{uiLabels.quizzer}} </template>
<span> {{uiLabels.idnotExist}} </span>
</createPopup>
</div>
<info>
  <template v-slot:helpinfo> {{uiLabels.joinQuizname}} </template>
</info>
</template>

<script>
import createPopup from '@/components/createPopup.vue';
import io from 'socket.io-client';
import info from '@/components/info.vue';
const socket = io();
export default {
  name: 'EditID',
  components:{
    createPopup,
    info,
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
@import url("/styleID.css");

  .results button{
    position:relative;
    display:flex;
    flex-direction: column;
    background-color:white;
    border:white;
    width: 12.3em;
    height:2em;
    padding:0.5em;
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

  .results{
    grid-row:2;
    background-color:transparent;
    height:15em;
    overflow-y:auto;
  }

  .resultShow{
    border-radius: 0;
    border-bottom: 1px solid black;
    background-color:white;
  }

  .showResults{
    box-shadow: 2px 2px 10px grey;
  }

  .gridWrap{
    grid-template-columns: 50% 30%;
  }
  .rightColumn{
    margin:0;
  }

  .position{
    left: 50%;
    top: 50%;
  }

  /*Annan layout för mobil */
  @media (max-width:551px){
    .rightColumn{
      margin-left:60%;
    }
  }


</style>
