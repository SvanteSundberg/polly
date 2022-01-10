<template style="max-height: 100%;">
  <router-view/>

</template>

<style>
@import 'https://fonts.googleapis.com/css2?family=Roboto&display=swap';
@import 'https://fonts.googleapis.com/css?family=Pangolin';
@import url('https://fonts.googleapis.com/css2?family=Yuji+Syuku&display=swap');
@import 'https://fonts.googleapis.com/css?family=Average';

#app {
  /*font-family: Average, Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-repeat: no-repeat;
  font-size:16pt;
}

#app input{
  font-family: 'Roboto', sans-serif;
  font-size: 14pt;
}

#app textarea{
  font-family: 'Roboto', sans-serif;
  font-size: 14pt;
}

#app ::placeholder{
  font-family: 'Roboto', sans-serif;
  font-size: 14pt;
}

.cursive{
  font-style: italic;
}

.bold{
  font-weight: bold;
}

#nav {
  padding: 0px;
}

#nav a {
  /*padding:0.4em;*/
  font-weight: bold;
  color: blue;
}

#nav a.router-link-exact-active {
  background-color: blue;
  color: white;
}

.party {
  /*font-family: 'Yuji Syuku', serif;*/
  font-family: 'Average', serif;
  background-image:url(/img/party_ballons.png);
  /*background-image:url("https://i.pinimg.com/736x/e9/67/19/e96719135721c06dbab7f1b34e65da26.jpg");*/
  height:100vh;
  background-size: cover;
  color:black;
  font-size:17pt;
}

#app .party button{
  font-family: 'Average', serif;
}

.school {
  background: url(/img/chalkboard.png);
  /*background-image:url("https://png.pngtree.com/thumb_back/fh260/background/20200809/pngtree-doodles-on-green-chalkboard-background-back-to-school-background-image_389839.jpg");*/
  height:100vh;
  background-size: cover;
  color:white;
  font-family: 'Pangolin', sans-serif;
}

#app .school button{
  font-family: 'Pangolin', sans-serif;
}

.standard{
  font-family: 'Roboto', sans-serif;
  background-image:url(/img/opacityStandard.png);
  height:100vh;
  background-size: cover;
  min-height: 100%;
  color:black;
}

#app .standard button{
  font-family: 'Roboto', sans-serif;
}

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

h1,h2,h3,p{
  margin-block-start: 0;
  margin-block-end: 0;
}

div {
  margin:auto;
}

.writeInput {
  border-radius: 20px;
  border: white;
  outline: none;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 10px;
  margin:auto;
  box-shadow: 0px 2px 2px rgba(0,0,0,0.11);
  display:flex;
}

.standBtn{
  border-radius: 20px;
  cursor: pointer;
  color: #fff;
  text-align:  center;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left:  10px;
}

.doneBtn{
  background-color:#2ECC40;
  border: 1px solid #2ECC40;
  box-shadow: 1px 1px 20px grey;
}

.addBtn{
  background-color: #7EBDE5;
  border: 1px solid #7EBDE5;
  box-shadow: 1px 1px 20px grey;
}


#app button:hover{
  border: 1px solid #fff;
  box-shadow: 2px 2px 20px #fff;
  cursor: pointer;
  font-weight:bold;
}

#app .party button:hover{
  box-shadow: 2px 2px 20px grey;
}

button{
  font-size:13pt;
  cursor: pointer;
}

.gridWrap{
  display:grid;
  grid-template-columns: 200px 50px;
  justify-content: center;
  grid-gap: 10px;
}

.leftColumn{
  float:right;
  grid-column: 1;
  grid-row:1;
}

.rightColumn{
  grid-column:2;
  margin-left:15%;
  grid-row:1;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: white;
  border-radius: 20px;
  border:1px solid #fff;
  opacity:0.8;
}

::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background: grey;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>
