<template>
  <router-view/>
</template>

<style>
@import 'https://fonts.googleapis.com/css2?family=Roboto&display=swap';
@import 'https://fonts.googleapis.com/css?family=Average';
@import 'https://fonts.googleapis.com/css?family=Pangolin';

#app {
  /*font-family: Average, Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 16pt;
  background-repeat: no-repeat;
}

#app button{
  font-family: 'Roboto', sans-serif;
}

#app input{
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
  padding: 30px;
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
  font-family: 'Roboto', sans-serif;
  background-image:url(/img/party_ballons.png);
  /*background-image:url("https://i.pinimg.com/736x/e9/67/19/e96719135721c06dbab7f1b34e65da26.jpg");*/
  height:100vh;
  background-size: cover;
}

.school {
  background: url(/img/chalkboard.png);
  /*background-image:url("https://png.pngtree.com/thumb_back/fh260/background/20200809/pngtree-doodles-on-green-chalkboard-background-back-to-school-background-image_389839.jpg");*/
  height:100vh;
  background-size: cover;
  color:white;
  font-family: 'Pangolin', sans-serif;
}

.standard{
  font-family: 'Roboto', sans-serif;
  background-image:url(/img/standard.png);
  height:100vh;
  background-size: cover;
}

body {
  margin: 0;
  padding: 0;
}

h1{
  margin-block-start: 0;
  margin-block-end: 0;
}

h3{
  margin-block-start: 0;
  margin-block-end: 0;
}

p{
  margin-block-start: 0;
  margin-block-end: 0;
}

button:hover {
  cursor: pointer;
}

div {
  margin:auto;
}

.writeInput {
  border-radius: 20px;
  border: white;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 10px;
  outline: none;
  margin:auto;
  box-shadow: 0px 2px 2px rgba(0,0,0,0.11);
  display:flex;
}

.doneBtn{

  background-color:#2ECC40;
  border: 1px solid #2ECC40;
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

.doneBtn:hover{
  border: 1px solid #fff;
  box-shadow: 2px 2px 20px #AFE9FF;
}

.gridWrap{
  display:grid;
  grid-template-columns: 200px 50px;
  justify-content: center;
}

.leftColumn{
  float:right;
  grid-column: 1;
}

.rightColumn{
  grid-column:2;
}

</style>
