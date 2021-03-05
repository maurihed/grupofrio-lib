<template>
  <div class="panel-dos">
    <panel-titulo :titulo="titulo"></panel-titulo>
    <div class="divider"></div>
      <div class="panel-content">
        <div class="panel-item" v-for="(col, index) in cols" :key="index">
          <panel-titulo v-if="col.titulo" :titulo="col.titulo"></panel-titulo>
          <div v-if="col.titulo" class="divider"></div>
          <span v-if="col.filter == 'money'" class="panel-dos-valor" :class="col.class">{{col.valor | money}}</span>
          <span v-if="col.filter == 'percentage'" class="panel-dos-valor" :class="col.class">{{col.valor | percentage}}</span>
          <span v-if="!col.filter" class="panel-dos-valor" :class="col.class">{{col.valor}}</span>
        </div>
      </div>
  </div>
</template>

<script>
import PanelTituloVue from './panel-titulo.vue'
export default {
  props: ['titulo', 'cols'],
  components: {
    'panel-titulo': PanelTituloVue,
  }
}
</script>

<style lang="scss" scoped>
  .panel-dos {
    font-size: 1.5rem;
    margin-bottom: 50px;
    background: rgb(251, 252, 251);
    outline: 1px solid #CCC;
    padding: 0 10px;
    .panel-content {
      padding: 5px;
      display: flex;
      .panel-item {
        .titulo {
          font-size: 16px;
        }
        &:first-child {
          border-right: 1px solid #16222c;
        }
        padding: 5px;
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .panel-dos-valor {
          font-family: axiforma bold;
          margin: 4px 0px 4px 0px;
          font-size: 16px;
          color: #2E3A8D;
        }
      }
    }
  }
</style>
