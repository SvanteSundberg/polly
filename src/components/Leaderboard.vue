<template>
	<div class="leaderboard">
				<h1>{{uiLabels.leaderboard}}</h1>

				<div>
				<div v-for= "user in this.users.slice(0, 5)" v-bind:key ="user">
          <div id="UserInLeaderborad">

						<div v-if = "user[0].length<7">{{user[0]}}: {{user[1]}}</div>
						<div v-if = "user[0].length === 7" id="len7">{{user[0]}}: {{user[1]}}</div>
						<div v-if = "user[0].length === 8" id= "len8">{{user[0]}}: {{user[1]}}</div>
						<div v-if = "user[0].length === 9" id="len9">{{user[0]}}: {{user[1]}}</div>
						<div v-if = "user[0].length === 10" id="len10">{{user[0]}}: {{user[1]}}</div>

          </div>
				</div>
			</div>

      </div>

</template>


<script>

export default {
  name: 'Leaderboard',
  props: {
    users: Object,
		uiLabels: Object,
  },
}

</script>

<style scoped>

*{
  line-height: 1.5;
  transition: all .3s ease-in-out;
  /*font-family: "Josefin Sans", Arial;*/
}

.leaderboard{
  border: 5px solid snow;
  background:#505050 ;
  color:snow;
  border-radius: 25px;
  width:90%;
	margin-left: 5%;
	margin-right: 5%;
	margin-bottom:2em;
	margin-top:8%;
}
.leaderboard h1{
	font-size: 100%;
}

#UserInLeaderborad{
  border-radius: 25px;
  border: 5px solid cyan;
  box-shadow: 0 0 20px cyan;
	padding-top: 3px;
	padding-bottom: 3px;
  margin-top: 30px;
  margin-bottom: 25px;
	margin-left: 5%;
	margin-right: 5%;
  text-align: center;
}
@media (max-width:550px) {
	#len7{
		font-size: 90%;
	}
	#len8{
		font-size: 80%;
	}
	#len9{
		font-size: 70%;
	}
	#len10{
		font-size: 60%;
	}
}


</style>
