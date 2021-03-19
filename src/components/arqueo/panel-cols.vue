<template>
  <div class="panel">
    <panel-titulo :titulo="titulo"></panel-titulo>
    <div class="divider"></div>
      <div class="row panelCols__container">
          <div class="center col s4 panelCols__col" v-for="col in cols" :key="col.titulo">
              <panel-titulo :titulo="col.titulo"></panel-titulo>
              <div class="divider"></div>
              <div class="panelCols__valor">{{col.valor | money}}</div>
          </div>
      </div>
  </div>
</template>
<script>
import panelTituloVue from './panel-titulo.vue';

export default {
  props: ['titulo','cols'],
  components: {
    'panel-titulo': panelTituloVue,
  },
}
</script>
<style lang="scss" scoped>
  .panel {
    padding: 0 10px;
  }
  .panelCols {
    &__valor {
      margin: 4px 0px 4px 0px;
      font-size: 1.1em;
      font-family: axiforma bold;
      color: #2E3A8D;
    }
    &__col {
      .titulo {
        font-size: 16px;
      }
      border-right: 1px solid #16222c;
      &:last-child {
        border: 0;
      }
    }
    &__container {
      padding: 5px;
    }
  }
</style>