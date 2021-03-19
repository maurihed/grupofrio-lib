<template>
  <div class="wrapper">
    <div class="titulo">
      <span>
        {{titulo}}
      </span>
    </div>
    <div class="valor">
      <div class="d">
        {{valor}} {{unidades ? unidades : ''}}
      </div>
      <div class="p">
        <v-porcentaje v-if="porcentaje || porcentaje == 0" :valor="porcentaje"></v-porcentaje>
      </div>
      <div class="p">
        <v-porcentajeGastos v-if="porcentajeGastos || porcentajeGastos == 0" :valor="porcentajeGastos"></v-porcentajeGastos>
      </div>
      <div class="pts">
        {{puntos}} {{puntos || puntos == 0 ? 'pts' : ''}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-wrapper',
  props: ['titulo', 'valor', 'porcentaje', 'porcentajeGastos', 'puntos', 'unidades'],
}
</script>

<style lang="scss" scoped>
  .wrapper {
    display: flex;
    width: 100%;
    color: #2d3a8d;
    font-family: axiforma bold;
    .titulo {
      width: 45%;
      justify-content: flex-end;
      display: flex;
      align-items: center;
      span {
        text-align: right;
      }
    }
    .valor {
      font-weight: bold;
      min-width: 135px;
      padding-left: 15px;
      display: flex;
      flex-grow: 1;
      align-items: center;
      .d {
        width: 50%;
      }
      .p {
        text-align: right;
        width: 20%;
      }
      .pts {
        text-align: center;
        width: 30%;
      }
    }
  }
</style>