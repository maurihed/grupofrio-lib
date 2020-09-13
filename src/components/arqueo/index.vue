<template>
<div>
  <div class="row">
    <div class="col s6">
        <panel-cols
          titulo="Resumen gastos"
          :cols="gastos"
        ></panel-cols>
    </div>
    <div class="col s6">
        <panel-cols
          titulo="Resumen Pagos"
          :cols="cols"
        ></panel-cols>
    </div>
  </div>
  <div class="row">
    <div class="col s12">
      <panel-table class="h-400" titulo="Total ventas" :data="ventas"></panel-table>
    </div>
    <div class="col s12">
      <panel-table class="h-400" titulo="Merma" :data="merma"></panel-table>
    </div>
    <div class="col s12 m6 mh-400">
      <panel-table class="h-400" titulo="Entradas" :data="entradas"></panel-table>
    </div>
    <div class="col s12 m6 mh-400">
      <panel-table class="h-400" titulo="Salidas" :data="salidas"></panel-table>
    </div>
  </div>
</div>
</template>
<script>
import panelcolsVue from './panel-cols.vue';
import panelSmallVue from './panel-small.vue';
import panelTableVue from './panel-table.vue';

export default {
  props: ['fecha', 'suc'],
  data: () => ({
    cols: [],
    merma: [],
    entradas: [],
    salidas: [],
    ventas: [],
    gastos: [],
  }),
  created() {
    this.cols = [
      { titulo:'Gasto contado', valor: 4257.45 },
      { titulo:'Gasto credito', valor: 4257.45 },
      { titulo:'Gasto Total', valor: 8514.90 },
    ];
    this.fetchMerma();
    this.fetchEntradasSalidas('Salidas');
    this.fetchEntradasSalidas('Entradas');
    this.getVentas();
    this.fetchGastos();
  },
  methods: {
    async fetchMerma() {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=getMerma`,{ fecha: this.fecha, suc: this.suc });
      this.merma = response.data.map((item) => ({
        Producto: item.Dscription,
        Cantidad: item.Quantity,
        Almacen: item.FromWhsCod,
        Merma: item.WhsCode
      }));
    },
    async fetchEntradasSalidas(tipo) {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=get${tipo}`,{ fecha: this.fecha, suc: this.suc });
      if(tipo == 'Entradas') {
        this.entradas = response.data.map((item) => ({
          Producto: item.Dscription,
          Cantidad: item.Quantity,
          Almacen: item.WhsCod,
        }));
      } else {
        this.salidas = response.data.map((item) => ({
          Producto: item.Dscription,
          Cantidad: item.Quantity,
          Almacen: item.WhsCod,
        }));
      }
    },
    async getVentas() {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=getVentas`,{ fecha: this.fecha, suc: this.suc });
      this.ventas = response.data;
    },
    async fetchGastos() {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=getGastos`,{ fecha: this.fecha, suc: this.suc });
          this.cols = [
      { titulo:'Gasto contado', valor: 4257.45 },
      { titulo:'Gasto credito', valor: 4257.45 },
      { titulo:'Gasto Total', valor: 8514.90 },
    ];
      this.gastos = [
        {titulo: 'Gasto contado', valor: response.data.contado },
        {titulo: 'Gasto credito', valor: response.data.credito },
        {titulo: 'Gasto total', valor: response.data.total },
      ];
    },
  },
  components:{
    'panel-cols': panelcolsVue,
    'panel-small': panelSmallVue,
    'panel-table': panelTableVue,
  },
}
</script>
<style lang="scss" scoped>
  .h-400 {
    height: 400px;
  }
</style>