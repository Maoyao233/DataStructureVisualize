<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> | 
      <router-link to="/sort">Sort</router-link> | 
      <router-link to="/josephus">Josephus</router-link>
    </div>  
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  margin-top: 60px;
  padding: 20px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

html {
  font: 700 16px/1 "Titillium Web", sans-serif;
  height: 731px;
  padding: 0;
  margin: 0;
}

body {
  margin: 0 0;
  color: #2c3e50;
  background-color: #eaebf0;
}
</style>
