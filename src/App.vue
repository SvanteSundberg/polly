<template>
  <router-view/>
</template>

<style>
@import 'https://fonts.googleapis.com/css?family=Average';

#app {
  font-family: Average, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 14pt;
}

#app button{
  font-family: Average, sans-serif;
}

#nav {
  padding: 30px;
}

#nav a {
  padding:0.4em;
  font-weight: bold;
  color: blue;
}

#nav a.router-link-exact-active {
  background-color: blue;
  color: white;
}

.party {
  background-image:url("https://i.pinimg.com/736x/e9/67/19/e96719135721c06dbab7f1b34e65da26.jpg");
  overflow:hidden;
}

.school {
    background-image:url("https://png.pngtree.com/thumb_back/fh260/background/20200809/pngtree-doodles-on-green-chalkboard-background-back-to-school-background-image_389839.jpg");
    overflow:hidden;
}

.work{
  background-color:green;
  overflow:hidden;
}
</style>
