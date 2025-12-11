<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script setup lang="ts">
interface Props {
  msg?: string
}

withDefaults(defineProps<Props>(), {
  msg: 'Hello World',
})
</script>

<style scoped>
.hello {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1 {
  margin: 40px 0 0;
  font-weight: normal;
}
</style>
