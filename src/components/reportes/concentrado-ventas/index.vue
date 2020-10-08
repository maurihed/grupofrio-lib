<template>
<div>
  <br>
  <progress-indicator :show="!isLoaded"></progress-indicator>
  <div v-if="isLoaded">
    <div class="row">
      <div class="col s6 center"><h5>Ventas</h5></div>
      <div class="col s6 center"><h5>Producción</h5></div>
      <div class="col s1">$</div>
      <div class="col s5">
        <div class="panel acumuladoContainer">
          <span>{{acumulado.Venta.dinero.Acumulado | money}}</span>
          <span>{{acumulado.Venta.dinero.Meta | money}}</span>
          <span>{{acumulado.Venta.dinero.Tendencia | number}}%</span>
        </div>
      </div>
      <div class="col s1">Rolito</div>
      <div class="col s5">
        <div class="panel acumuladoContainer">
          <span>{{acumulado.Produccion.rolito.Acumulado | number}}</span>
          <span>{{acumulado.Produccion.rolito.Meta | number}}</span>
          <span>{{acumulado.Produccion.rolito.Tendencia | number}}%</span>
        </div>
      </div>
      <div class="col s1">Kg</div>
      <div class="col s5">
        <div class="panel acumuladoContainer">
          <span>{{acumulado.Venta.kg.Acumulado | number}}</span>
          <span>{{acumulado.Venta.kg.Meta | number}}</span>
          <span>{{acumulado.Venta.kg.Tendencia | number}}%</span>
        </div>
      </div>
       <div class="col s1">Barra</div>
      <div class="col s5">
        <div class="panel acumuladoContainer">
          <span>{{acumulado.Produccion.barra.Acumulado | number}}</span>
          <span>{{acumulado.Produccion.barra.Meta | number}}</span>
          <span>{{acumulado.Produccion.barra.Tendencia | number}}%</span>
        </div>
      </div>
    </div>
    <ul class="collapsible expandable">
      <li>
        <div class="collapsible-header"><i class="material-icons">attach_money</i>Equipo de venta</div>
          <div class="collapsible-body">
            <progress-indicator :show="loadingVentas"></progress-indicator>
            <div v-if="!loadingVentas">
              <ul class="collapsible expandable">
                <li v-for="day in weekDays" :key="day.day">
                  <div class="collapsible-header"><i class="material-icons">adjust</i>{{day.dayName}} ({{day.date}})</div>
                  <div class="collapsible-body">
                    <div class="">
                      <table>
                        <thead>
                          <tr>
                            <th>Nombre del vendedor</th>
                            <th class="center" v-for="(topic, index) in topics" :key="index" >{{topic}}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(venta, vendedor) in getVentasRow(day.date)" :key="vendedor">
                            <td>{{vendedor}}</td>
                            <td v-for="(val, index) in Object.values(venta)" :key="index">
                              <tabla-celda
                                :value="val"
                              >
                              </tabla-celda>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </li>
              </ul>
              <table class="panel">
                <thead>
                  <tr>
                    <th>Nombre vendedor</th>
                    <th class="center" v-for="(topic, index) in topics" :key="index" >{{topic}}</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="(vendedor, index) in getVendedores()" :key="index">
                    <td>{{vendedor}}</td>
                    <td v-for="name in ventasNames" :key="name">
                      <tabla-celda
                        :value="getAcumuladoVenta(vendedor, name)"
                      >
                      </tabla-celda>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      </li>
      <li>
        <div class="collapsible-header"><i class="material-icons">add_shopping_cart</i>Equipo de produccion</div>
        <div class="collapsible-body">
          <progress-indicator :show="loadingProduccion"></progress-indicator>
          <div v-if="!loadingProduccion">
            <ul class="collapsible expandable">
              <li v-for="day in weekDays" :key="day.day">
                <div class="collapsible-header"><i class="material-icons">adjust</i>{{day.dayName}} ({{day.date}})</div>
                <div class="collapsible-body">
                  <div class="">
                    <table>
                      <thead>
                        <tr>
                          <th>Turno</th>
                          <th>Barra</th>
                          <th>Rolito</th>
                          <th>Agua</th>
                          <th>Luz</th>
                          <th>Mantenimiento</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(prod, turno) in getProduccionRow(day.date)" :key="'prod-'+turno">
                          <td>{{turno}}</td>
                          <td v-for="(val, index) in Object.values(prod)" :key="index">
                            <tabla-celda
                              :value="val"
                            >
                            </tabla-celda>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </li>
            </ul>
            <table class="panel">
              <thead>
                <tr>
                  <th>Turno</th>
                  <th>Producción</th>
                  <th>Eficiencia</th>
                  <th>Agua</th>
                  <th>Luz</th>
                  <th>Mantenimiento</th>
                </tr>
              </thead>
              <tbody>
                  <tr v-for="(turno, index) in getTurnos()" :key="index">
                  <td>{{turno}}</td>
                  <td v-for="name in produccionNames" :key="name">
                    <tabla-celda
                      :value="getAcumuladoProduccion(turno, name)"
                    >
                    </tabla-celda>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </li>
      <li>
        <div class="collapsible-header"><i class="material-icons">business</i>Metas gerente planta</div>
        <div class="collapsible-body"> 
          <progress-indicator :show="loadingGerente"></progress-indicator>
          <div v-if="!loadingGerente">
            <table>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th v-for="(week, index) in getWeeks()" :key="index" >{{week}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(topic, index) in Object.keys(gerente)" :key="'gerente-'+index">
                  <td>{{topic}}</td>
                  <td v-for="(val, index) in Object.values(gerente[topic])" :key="index">
                    <tabla-celda
                      :value="val"
                    >
                    </tabla-celda>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </li>
      <li>
        <div class="collapsible-header"><i class="material-icons">trending_up</i>Metas administrativo</div>
        <div class="collapsible-body">
          <progress-indicator :show="loadingAdmin"></progress-indicator>
          <div v-if="!loadingAdmin">
            <table>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th v-for="day in weekDays" :key="day.day">{{day.dayName}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(topic, index) in Object.keys(administrativo)" :key="'administrativo-'+index">
                  <td>{{topic}}</td>
                  <td v-for="(val, index) in Object.values(administrativo[topic])" :key="index">
                    <div class="panel two-cols">
                      <span class="diferencia" v-if="topic != 'GastosPagos'">{{val.diferencia | number}}</span>
                      <span class="diferencia" v-if="topic == 'GastosPagos'">{{val.diferencia | money}}</span>
                      <div class="status">
                        <span v-if="val.status"><i class="material-icons indigo-text text-darken-2">check_circle</i></span>
                        <span v-if="!val.status"><i class="material-icons red-text text-darken-2">cancel</i></span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import { getWeekDays } from '../../../assets/js/date-utilities';
import tablaCeldaVue from './tabla-celda.vue';

export default {
  props: ['suc', 'fecha'],
  data: () => ({
    isLoaded: false,
    loadingVentas: true,
    loadingProduccion: true,
    loadingGerente: true,
    loadingAdmin: true,
    weekdays: [],
    ventas: [],
    ventasNames: [],
    produccion: [],
    gerente: [],
    administrativo: {},
    workedDays: {},
    acumulado: {},
    topics: ['Kilos', 'Productividad', 'Captura App', 'Km x litro'],
  }),
  async created() {
    this.weekDays = getWeekDays(this.fecha);
    const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=acumulado`, { fecha: this.fecha, suc: this.suc });
    this.acumulado = response.data;
    this.isLoaded = true;
    await Promise.allSettled([
      this.fetchVentas(),
      this.fetchProduccion(),
      this.fetchGerente(),
      this.fetchAdmin(),
    ]);
  },
  updated() {
    M.Collapsible.init(document.querySelectorAll('.collapsible'),);
  },
  methods:{
    async fetchVentas(){
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=ventas`, { fecha: this.fecha, suc: this.suc });
      this.ventas = response.data;
      this.ventasNames = this.getVentasNames();
      this.setWorkedDay();
      this.loadingVentas = false;
    },
    async fetchProduccion(){
      const rProduccion = await axios.post(`${env.REPORTES_CONCENTRADO}?option=produccion`, { fecha: this.fecha, suc: this.suc });
      this.produccion = rProduccion.data;
      this.produccionNames = this.getProduccionNames();
      this.loadingProduccion=false;
    },
    async fetchGerente(){
      const rGerente = await axios.post(`${env.REPORTES_CONCENTRADO}?option=gerente`, { fecha: this.fecha, suc: this.suc });
      this.gerente = rGerente.data;
      this.loadingGerente=false;
    },
    async fetchAdmin(){
      const rAdministrativo = await axios.post(`${env.REPORTES_CONCENTRADO}?option=administrativo`, { fecha: this.fecha, suc: this.suc });
      this.administrativo = rAdministrativo.data;
      this.loadingAdmin=false;
    },
    getVentasRow(fecha) {
      return this.ventas[fecha];
    },
    getProduccionRow(fecha) {
      return this.produccion[fecha];
    },
    getTurnos() {
      const [firstDate] = Object.values(this.produccion);
      if (firstDate) {
        return Object.keys(firstDate);
      }
      return [];
    },
    getProduccionNames() {
      const [firstDate] = Object.values(this.produccion);
      if (firstDate) {
        const [firstTurno] = Object.values(firstDate);
        if (firstTurno) {
          return Object.keys(firstTurno);
        }
      }
      return [];
    },
    setWorkedDay() {
      let vendedores = [];
      Object.values(this.ventas).forEach((v) => {
        vendedores = vendedores.concat(Object.keys(v));
      });
      const total = {};
      vendedores.forEach(v => {
        if (!total[v]) {
          total[v] = 1;
        } else {
          total[v]++;
        }
      });
      this.workedDays = total;
    },
    getVendedores() {
      let vendedores = [];
      Object.values(this.ventas).forEach((v) => {
        vendedores = vendedores.concat(Object.keys(v));
      });
      return [...new Set(vendedores)];
    },
    getVentasNames() {
      const [firstFecha] = Object.values(this.ventas);
      if (firstFecha) {
        const [firtVendedor] = Object.values(firstFecha);
        if (firtVendedor) {
          return Object.keys(firtVendedor);
        }
      }
      return []
    },
    getWeeks() {
      const [first] = Object.values(this.gerente);
      if (first) {
        return Object.keys(first);
      }
      return [];
    },
    getAcumuladoVenta(vendedor, name) {
      const val = Object.values(this.ventas).reduce((total, item) => {
        if (item[vendedor] && item[vendedor][name]) {
          total.real += item[vendedor][name].real;
          total.meta += item[vendedor][name].meta;
        }
        return { ...total };
      }, {
        real: 0,
        meta: 0,
      });
      if (name == 'kmxlitro') {
        val.real /= this.workedDays[vendedor];
        val.meta /= this.workedDays[vendedor];
      } else {
        val.real /= 6;
        val.meta /= 6;
      }
      return val;
    },
    getAcumuladoProduccion(turno, name) {
      const val = Object.values(this.produccion).reduce((total, item) => {
        if (item[turno] && item[turno][name]) {
          total.real += item[turno][name].real;
          total.meta += item[turno][name].meta;
        }
        return { ...total };
      }, {
        real: 0,
        meta: 0,
      });
      val.real /= 7;
      val.meta /= 7;
      return val;
    }
  },
  components: {
    'tabla-celda': tablaCeldaVue,
  },
}
</script>

<style lang="scss" scoped>
  .panel {
    font-size: 0.9rem;
    .diferencia {
      width: 50%;
      border-right: 1px solid gray;
      display: flex;
      justify-content: center;
      align-content: center;
    }
    .status {
      width: 50%;
      display: flex;
      justify-content: center;
      align-content: center;
    }
  }
  .two-cols {
    padding: 0;
    display: flex;
    align-content: center;
    margin: 0;
  }
  .acumuladoContainer {
    padding: 0;
    display: flex;
    justify-content: space-between;
    span {
      width: 33%;
      border-right: 1px solid #cccccc;
      &:last-child{
        border-right: none;
      }
    }
  }
</style>