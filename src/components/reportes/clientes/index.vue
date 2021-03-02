<template>
  <div>
    <div class="panel reporteCliente">
      <div class="row">
        <div class="col s4">
          <div class="input-field">
            <select v-model="sucSelected" @change="fetchClients" id="sucursales">
              <option v-for="sucItem in sucs" :key="sucItem.Name" :value="sucItem.Name">{{sucItem.Remarks}}</option>
            </select>
            <label for="sucursales">Sucursales</label>
          </div>
        </div>
        <div class="col s5">
          <search-select
            title="Clientes"
            v-model="clientSelected"
            :options="formatedClients()"
            placeholder="Seleccione un cliente"
          ></search-select>
        </div>
        <div class="col s3">
          <button @click="fetchClientData" class="btn btn-csutom">Consultar</button>
        </div>
      </div>
    </div>
    <section v-if="clientData">
      <progress-indicator :show="!isLoaded"></progress-indicator>
      <div v-if="isLoaded">
        <div class="row">
          <div class="col s12 m6 l4 mb-1">
            <reporte-card :data="clientData.info"></reporte-card>
          </div>
          <div class="col s12 m6 l4 mb-1">
            <reporte-card :data="routeInfo"></reporte-card>
          </div>
          <div class="col s12 m6 l4 mb-1">
            <reporte-card :data="clientData.sales" :moneyFormat="[2]"></reporte-card>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m6">
            <reporte-table
              title="Productos"
              :data="clientData.lastProducts"
            ></reporte-table>
          </div>
          <div class="col s12 m6">
            <reporte-table
              title="Últimas Ventas"
              :data="clientData.lastSales"
            ></reporte-table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ProgressIndicatorVue from '../../common/progress-indicator.vue';
import ReporteCardVue from './reporte-card.vue';
import ReporteTableVue from './reporte-table.vue';

export default {
    props: ['sucursales', 'suc'],
    data: () => ({
        sucs: [],
        clients: [],
        clientData: null,
        clientSelected: null,
        sucSelected: null,
        isLoaded: false,
    }),
    mounted(){
        this.sucs = JSON.parse(this.sucursales); 
        this.sucSelected = this.suc;
        this.fetchClients();
    },
    updated() {
      M.FormSelect.init(document.querySelectorAll('select'));
    },
    computed: {
      routeInfo() {
        if (!this.clientData) return {};
        return {
          "Dias de visita": this.clientData.route.frecuencia.trim(),
          "Ruta": this.clientData.route.name,
          "Capacidad": this.clientData.capacity.capacidad,
          "Conservador": this.clientData.capacity.numeroSerie
        };
      }
    },
    methods: {
        async fetchClients() {
            const response = await axios.post(`${env.REPORTE_CLIENTE}?option=getClients`, { suc: this.sucSelected });
            this.clientSelected = null;
            this.clients = response.data;
        },
        async fetchClientData() {
            this.isLoaded = false;
            this.clientData = {};
            const response = await axios.post(`${env.REPORTE_CLIENTE}?option=getClientData`, {clave: this.clientSelected});
            this.clientData = response.data;
            this.isLoaded = true;
        },
        formatedClients() {
          return this.clients.map((client) => ({ id: client.CardCode, label: client.CardName }));
        }
    },
    components: {
      'reporte-card': ReporteCardVue,
      'progress-indicator': ProgressIndicatorVue,
      'reporte-table': ReporteTableVue,
    }
}
</script>

<style lang="scss" scoped>

</style>
