<template>
<div v-for="user in this.users" v-bind:key ="user">
  {{user}}
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

</style>
