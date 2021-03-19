<template>
  <div class="titulo">{{titulo1}} <span class="text-bold">{{titulo2}}</span></div>
</template>
<script>
export default {
  props:['titulo'],
  computed: {
    titulo1() {
      if (!this.titulo) return '';
      const titulo = this.titulo.split(' ');
      if (titulo.length > 1) {
        titulo.pop();
      }
      return titulo.join(' ');
    },
    titulo2() {
      if (!this.titulo) return '';
      const titulo = this.titulo.split(' ');
      if (titulo.length > 1) {
        return titulo.pop();
      }
      return '';
    }
  },
}
</script>
<style lang="scss" scoped>
  .titulo {
    color: #999999;
    font-family: axiforma thin;
    font-size: 1em;
    .text-bold {
      font-family: axiforma bold;
    }
  }
</style>