<template>
  <div class="panel">
    <panel-titulo class="h3" :titulo="titulo"></panel-titulo>
    <div class="divider"></div>
    <div :class="{'table-responsive': true, 'scrollable': addScrollClass}">
      <table>
        <thead>
          <tr>
            <td v-for="(header, i) in headers" :key="i">{{header}}</td>
            <td v-if="extra">Estado</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in parsedData" :key="'row'+i">
            <td v-for="(col, i) in Object.values(row)" :key="i">{{col | number}}</td>
            <td v-if="extra && extra[i]" class="center indigo-text text-darken-2">
              <span><i class="material-icons">check_circle</i></span>
            </td>
            <td v-if="extra && !extra[i]" class="center red-text text-darken-2">
              <span><i class="material-icons">cancel</i></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import panelTituloVue from './panel-titulo.vue';

export default {
  props:['titulo', 'data', 'extra', 'scrollable'],
  data:()=>({
    parsedData: {},
    addScrollClass: true,
  }),
  created() {
    if (this.scrollable != undefined) {
      this.addScrollClass = this.scrollable;
    }
      console.log(this.addScrollClass, this.scrollable);
    if(typeof this.data == 'string') {
      this.parsedData = JSON.parse(this.data);
      this.parsedData = JSON.parse(this.parsedData);
    }
    this.parsedData = this.data;
  },
  computed: {
    headers() {
      const data = Object.values(this.parsedData);
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
    &.scrollable {
      max-height: 334px !important;
      overflow: auto;
    }
    table {
      font-size: 0.9rem;
    }
  }
</style>