<template>
  <span :class="color">
    {{porcentaje}} %
  </span>
</template>
<script>
export default {
  name: 'porcentaje-eficiencia',
  props: ['variable','total'],
  computed:{
    porcentaje() {
      if (!this.variable) return 0;
      if (!Number(this.variable.valor)) return 0;
      return (this.total / this.variable.valor * 100).toFixed(2);
    },
    color() {
      return this.porcentaje < 50 ? 'red-text' : 'green-text';
    }
  }
}
</script>