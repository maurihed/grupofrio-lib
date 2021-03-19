<template>
  <div class="porcentajeGastos" :class="getclassP()">
    <span>{{Math.round(valor)}}%</span>
  </div>
</template>

<script>
export default {
  name: 'v-porcentajeGastos',
  props: ['valor'],
  methods: {
    getclassP() {
      if(this.valor >100) {
        return 'malo';
      }
      if(this.valor == 100) {
        return 'regular';
      }
      return 'bueno';
    }
  }
}
</script>

<style lang="scss" scoped>
  .porcentajeGastos {
    width: 30px;
    display: inline-block;
    border: 1px solid;
    font-size: .6rem;
    border-radius: 5px;
    padding: 1px;
    color: #212121;
    &.bueno {
      border: 2px solid #84d0c1;
      background: #c9fef6;
    }
    &.malo {
      border: 2px solid #f5b0b6;
      background: #ffd7e1;
    }
    &.regular {
      border: 2px solid #c7cbd0;
      background: #f9f2d0;
    }
  }
</style>
