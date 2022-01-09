<template>
	<div class="leaderboard">
				<h1>Leaderboard</h1>

				<div>
				<ol v-for= "user in this.users" v-bind:key ="user">
          <div id="UserInLeaderborad">

						<small>{{user[0]}}: {{user[1]}}</small>

          </div>
				</ol>
			</div>

      </div>

</template>


<script>

export default {
  name: 'Leaderboard',
  props: {
    users: Object
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
	margin-bottom:2em;
}
.leaderboard h1{
	font-size: 100%;
}

#UserInLeaderborad{
  border-radius: 25px;
  border: 5px solid cyan;
  box-shadow: 0 0 20px cyan;
  margin-top: 30px;
  margin-bottom: 25px;
  margin-right: 10%;
	margin-left: auto;
  text-align: center;
}

</style>
