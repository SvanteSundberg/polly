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
</style>
