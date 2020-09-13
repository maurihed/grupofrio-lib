<template>
  <div class="panel">
    <panel-titulo :titulo="titulo"></panel-titulo>
    <div class="divider"></div>
    <div class="center panelSmall__value"> $922,161.63 </div>
  </div>
</template>
<script>
import panelTituloVue from './panel-titulo.vue';

export default {
  props:['titulo', 'value'],
  components: {
    'panel-titulo': panelTituloVue
  }
}
</script>
<style lang="scss" scoped>
  .panel {
    padding: 0 15px;
  }
  .panelSmall {
    &__value {
      color: #2E3A8D;
      font-family: axiforma bold;
      font-size: 1.2em;
      text-align: center;
    }
  }
</style>