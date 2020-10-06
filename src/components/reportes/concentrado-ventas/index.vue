<template>
<div>
  <div v-if="!isLoaded">
    is loading...
  </div>
  <div v-if="isLoaded">
    <ul class="collapsible expandable">
      <li>
        <div class="collapsible-header"><i class="material-icons">attach_money</i>Equipo de venta</div>
          <div class="collapsible-body">
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
      </li>
      <li>
        <div class="collapsible-header"><i class="material-icons">add_shopping_cart</i>Equipo de produccion</div>
        <div class="collapsible-body"> 
          <ul class="collapsible expandable">
            <li v-for="day in weekDays" :key="day.day">
              <div class="collapsible-header"><i class="material-icons">adjust</i>{{day.dayName}} ({{day.date}})</div>
              <div class="collapsible-body">
                <div class="">
                  <table>
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
    weekdays: [],
    ventas: [],
    ventasNames: [],
    produccion: [],
    topics: ['Kilos', 'Productividad', 'Captura App', 'Km x litro'],
  }),
  async created() {
    this.weekDays = getWeekDays(this.fecha);
    const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=ventas`, { fecha: this.fecha, suc: this.suc });
    this.ventas = response.data;
    this.ventasNames = this.getVentasNames();
    const rProduccion = await axios.post(`${env.REPORTES_CONCENTRADO}?option=produccion`, { fecha: this.fecha, suc: this.suc });
    this.produccion = rProduccion.data;
    this.produccionNames = this.getProduccionNames();
    this.isLoaded = true;
  },
  updated() {
    M.Collapsible.init(document.querySelectorAll('.collapsible'),);
  },
  methods:{
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
    getAcumuladoVenta(vendedor, name) {
      return Object.values(this.ventas).reduce((total, item) => {
        if (item[vendedor] && item[vendedor][name]) {
          total.real += item[vendedor][name].real;
          total.meta += item[vendedor][name].meta;
        }
        return { ...total };
      }, {
        real: 0,
        meta: 0,
      });
    },
    getAcumuladoProduccion(turno, name) {
      return Object.values(this.produccion).reduce((total, item) => {
        if (item[turno] && item[turno][name]) {
          total.real += item[turno][name].real;
          total.meta += item[turno][name].meta;
        }
        return { ...total };
      }, {
        real: 0,
        meta: 0,
      });
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
  }
</style>