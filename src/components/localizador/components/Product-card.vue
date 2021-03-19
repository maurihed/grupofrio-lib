<template>
  <div class="productCard">
    <div><span>Descripción: </span> <span class="text-bold">{{producto.descripcion}}</span></div>
    <div><span>Cantidad: </span> <span class="text-bold">{{producto.cantidad | number}} pza</span></div>
    <div><span>Importe: </span> <span class="text-bold">{{producto.importe | money}}</span></div>
    <div><span>Kilos: </span> <span class="text-bold">{{producto.cantidad | number}} kg</span></div>
    <div><span>Hora: </span> <span class="text-bold">{{producto.hora | HLHour}}</span></div>
  </div>
</template>
<script>
export default {
  name: 'Product-card',
  props: {
    producto: {
      type: Object,
    }
  }
}
</script>
<style lang="scss" scoped>
  .productCard {
    margin-bottom: 10px;
    padding-left: 10px;
    border-left: 2px solid #2e3b8d;
  }
</style>