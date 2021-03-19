<template>
  <div>
    <div v-for="fila in Number(filas)" :key="fila" >{{fila}}</div>
  </div>
</template>
<script>
export default {
  props: ['filas'],
}
</script>