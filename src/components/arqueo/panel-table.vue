<template>
  <div class="panel">
    <panel-titulo class="h3" :titulo="titulo"></panel-titulo>
    <div class="divider"></div>
    <div :class="{'table-responsive': true, 'scrollable': scrollable}">
      <table>
        <thead>
          <tr>
            <td v-for="(header, i) in headers" :key="i"><span v-if="header !== 'Crecimiento'">{{header}}</span></td>
            <td v-if="extra">Estado</td>
            <td v-if="crecimiento">%</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in parsedData" :key="'row'+i">
            <td v-for="([name, col], j) in Object.entries(row)" :key="j">
              <span v-if="name !== 'Crecimiento' && (porcentaje.length == 0 || (porcentaje.length > 0 && !porcentaje.includes(j)))">{{col | number}}</span>
              <span class="green-text text-darken-2" v-if="name !== 'Crecimiento' && porcentaje.length > 0 && porcentaje.includes(j) && col >= 85">{{col}}%</span>
              <span class="red-text text-darken-2" v-if="name !== 'Crecimiento' && porcentaje.length > 0 && porcentaje.includes(j) && col < 85">{{col}}%</span>
            </td>
            <td :class="getClass(row.Crecimiento)">{{row.Crecimiento}}%</td>
            <td v-if="extra && extra[i]" class="center indigo-text text-darken-2">
              <span><i class="material-icons">check_circle</i></span>
            </td>
            <td v-if="extra && !extra[i]" class="center red-text text-darken-2">
              <span><i class="material-icons">cancel</i></span>
            </td>
          </tr>
          <tr v-if="total">
            <td class="text-bold black-text b-none">Total: </td>
            <td class="text-bold black-text b-none" v-for="i in (headers.length-1)" :key="i">
              <span v-if="porcentaje.length == 0 || (porcentaje.length > 0 && !porcentaje.includes(i))">{{getTotal(i) | number}}</span>
              <span class="green-text text-darken-2" v-if="porcentaje.length > 0 && porcentaje.includes(i) && getTotal(i) >= 85">{{getTotal(i)}}%</span>
              <span class="red-text text-darken-2" v-if="porcentaje.length > 0 && porcentaje.includes(i) && getTotal(i) < 85">{{getTotal(i)}}%</span>
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
  props: {
    titulo: String,
    data: Array|Object,
    extra: Object,
    scrollable: {
      type: Boolean,
      default: true,
    },
    porcentaje: {
      type: Array,
      default: []
    },
    total: Boolean,
    crecimiento: Boolean,
  },
  data:()=>({
    parsedData: {},
  }),
  created() {
    if(typeof this.data == 'string') {
      try {
        this.parsedData = JSON.parse(this.data);
        this.parsedData = JSON.parse(this.parsedData);
      } catch(e) {}
    } else {
      this.parsedData = this.data;
    }
  },
  computed: {
    headers() {
      const data = Object.values(this.parsedData);
      if (data.length) {
        return Object.keys(data[0]);
      }
      return [];
    }
  },
  methods:{
    getTotal(index) {
      const total = Object.values(this.parsedData).length;
      if(typeof Object.values((Object.values(this.parsedData)[0] || [['']]))[index] == 'string') {
        return '';
      }
      const suma = Object.values(this.parsedData).reduce((total, item) => total += Number(Object.values(item)[index]), 0);
      if (this.porcentaje.includes(index)) {
        return total ? (Math.floor(suma/total)) : 0;
      }
      return Number(suma);
    },
    getClass(crecimiento) {
      if (crecimiento && crecimiento == 0) return '';
      if (crecimiento && crecimiento > 0) return 'green-text text-darken-2';
      return 'red-text text-darken-2';
    }
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