<template>
  <div class="panel">
    <panel-titulo class="h3" :titulo="titulo"></panel-titulo>
    <div class="divider"></div>
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <td v-for="(header, i) in headers" :key="i">{{header}}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in data" :key="'row'+i">
            <td v-for="(col, i) in Object.values(row)" :key="i">{{col | number}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import panelTituloVue from './panel-titulo.vue';

export default {
  props:['titulo', 'data'],
  data:()=>({ }),
  computed: {
    headers() {
      const data = Object.values(this.data);
      if (data.length) {
        return Object.keys(data[0]);
      }
      return [];
    },
  },
  components: {
    'panel-titulo': panelTituloVue,
  },
}
</script>
<style lang="scss" scoped>
  .h3 {
    font-size: 30px;
  }
  .table-responsive {
    max-height: 334px !important;
    overflow: auto;
    table {
      font-size: 0.9rem;
    }
  }
</style>