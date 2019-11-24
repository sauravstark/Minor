<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      colors: {'icing': '#DAE9E4', 'bora-bora': '#8BCBCB', 'sakura': '#ECC7C0', 'melon': 'FDAE84', 'cranberry': '#3C2E3D'}
    }
  }
}
</script>

<style>
#app {
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #3C2E3D;
}
</style>
