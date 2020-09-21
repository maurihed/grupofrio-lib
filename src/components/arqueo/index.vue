<template>
<div class="center">
  <br>
  <div v-if="!isLoaded">
    <div class="preloader-wrapper big active">
      <div class="spinner-layer spinner-blue-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
    <br>
    <div>{{(progres * 100 / 9).toFixed(2)}}%</div>
  </div>
  <div v-if="isLoaded">
    <div class="row">
      <div class="col s12">
        <panel-table :extra="extraMerma" class="h-400" titulo="Merma" :data="merma"></panel-table>
      </div>
      <div class="col s12">
        <panel-table :extra="extraUnidades" class="h-400" titulo="Unidades" :data="unidades"></panel-table>
      </div>
      <div class="col s12">
        <panel-table :extra="extraAlmacen" class="h-400" titulo="Almacen" :data="almacen"></panel-table>
      </div>
      <div class="col s12 m6 mh-400">
        <panel-table class="h-400" titulo="Entradas" :data="entradas"></panel-table>
      </div>
      <div class="col s12 m6 mh-400">
        <panel-table class="h-400" titulo="Salidas" :data="salidas"></panel-table>
      </div>
      <div class="col s12">
        <panel-table class="h-400" titulo="Total ventas" :data="ventas"></panel-table>
      </div>
    </div>
    <div class="row">
      <div class="col s12 m4">
          <panel-cols
            titulo="Resumen Ventas"
            :cols="ventasResumen"
          ></panel-cols>
      </div>
      <div class="col s12 m4">
          <panel-cols
            titulo="Resumen gastos"
            :cols="gastos"
          ></panel-cols>
      </div>
      <div class="col s12 m4">
          <panel-cols
            titulo="Resumen Pagos"
            :cols="pagos"
          ></panel-cols>
      </div>
      <div class="col s12 m12">
          <panel-cols
            titulo="Concentrado"
            :cols="concentrado"
          ></panel-cols>
      </div>
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
    isLoaded: false,
    progres: 0,
    cols: [],
    merma: [],
    almacen: [],
    unidades: [],
    entradas: [],
    salidas: [],
    ventas: [],
    ventasResumen: [],
    gastos: [],
    pagos: [],
    concentrado: [],
    extraMerma: {},
    extraUnidades: {},
    extraAlmacen: {},
  }),
  async created() {
    this.cols = [
      { titulo:'Gasto contado', valor: 4257.45 },
      { titulo:'Gasto credito', valor: 4257.45 },
      { titulo:'Gasto Total', valor: 8514.90 },
    ];
    await Promise.all([
      this.fetchMerma(),
      this.fetchEntradasSalidas('Salidas'),
      this.fetchEntradasSalidas('Entradas'),
      this.getVentas(),
      this.fetchVentasResumen(),
      this.fetchGastos(),
      this.fetchPagos(),
      this.fetchUnidades(),
      this.fetchAlmacen(),
    ]);
    this.initConcentrado();
    this.isLoaded = true;
  },
  methods: {
    initConcentrado() {
      const contado = this.ventasResumen.find((item)=> item.titulo == 'Venta contado').valor;
      const pagado = this.pagos.find((item)=> item.titulo == 'Gasto local').valor;
      const total = contado - pagado;
      this.concentrado = [
        { titulo:'Contado', valor: contado },
        { titulo:'Pagado Local', valor: pagado },
        { titulo:'Total', valor: total },
      ];
    },
    arrayToObject(array) {
      const obj = {};
      array.forEach((item) => {
        const [key] = Object.keys(item);
        const [value] = Object.values(item);
        obj[key] = value;
      });
      return obj;
    },
    async fetchMerma() {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=getMerma`,{ fecha: this.fecha, suc: this.suc });
      this.merma = response.data;
      const temp = Object.keys(this.merma).map((key) => {
        const item = this.merma[key];
        return {[key]: item.Diferencia == item.Merma};
      });
      this.extraMerma = this.arrayToObject(temp);
      this.progres++;
    },
    async fetchUnidades() {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=getUnidades`,{ fecha: this.fecha, suc: this.suc });
      this.unidades = response.data;
      const temp = Object.keys(this.unidades).map((key) => {
        const item = this.unidades[key];
        return {[key]: item.Diferencia == item.Inventario};
      });
      this.extraUnidades = this.arrayToObject(temp);
      this.progres++;
    },
    async fetchAlmacen() {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=getAlmacen`,{ fecha: this.fecha, suc: this.suc });
      this.almacen = response.data;
      const temp = Object.keys(this.almacen).map((key) => {
        const item = this.almacen[key];
        return {[key]: item.Diferencia == item.Inventario};
      });
      this.extraAlmacen = this.arrayToObject(temp);
      this.progres++;
    },
    async fetchEntradasSalidas(tipo) {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=get${tipo}`,{ fecha: this.fecha, suc: this.suc });
      if(tipo == 'Entradas') {
        this.entradas = response.data.map((item) => ({
          Producto: item.Dscription,
          Cantidad: item.Quantity,
          Almacen: item.WhsCode,
        }));
      } else {
        this.salidas = response.data.map((item) => ({
          Producto: item.Dscription,
          Cantidad: item.Quantity,
          Almacen: item.WhsCode,
        }));
      }
      this.progres++;
    },
    async getVentas() {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=getVentas`,{ fecha: this.fecha, suc: this.suc });
      this.ventas = response.data;
      this.progres++;
    },
    async fetchVentasResumen() {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=getVentasResumen`,{ fecha: this.fecha, suc: this.suc });
      this.ventasResumen = [
        {titulo: 'Venta contado', valor: response.data.contado },
        {titulo: 'Venta credito', valor: response.data.credito },
        {titulo: 'Venta total', valor: response.data.total },
      ];
      this.progres++;
    },
    async fetchGastos() {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=getGastos`,{ fecha: this.fecha, suc: this.suc });
      this.gastos = [
        {titulo: 'Gasto local', valor: response.data.local },
        {titulo: 'Gasto corporativo', valor: response.data.corpo },
        {titulo: 'Gasto total', valor: response.data.total },
      ];
      this.progres++;
    },
    async fetchPagos() {
      const response = await axios.post(`${env.REPORTES_ARQUEO}?option=getPagos`,{ fecha: this.fecha, suc: this.suc });
      this.pagos = [
        {titulo: 'Gasto local', valor: response.data.local },
        {titulo: 'Gasto corporativo', valor: response.data.corpo },
        {titulo: 'Gasto total', valor: response.data.total },
      ];
      this.progres++;
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