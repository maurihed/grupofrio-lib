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
                        <th>Nombre del vendedor</th>
                        <th>Producción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Barra matutino</td>
                        <td>
                          <tabla-celda
                            :value="produccion[day.date][0].MATUTINO.barra"
                          >
                          </tabla-celda>
                        </td>
                      </tr>
                      <tr>
                        <td>Rolito matutino</td>
                        <td>
                          <tabla-celda
                            :value="produccion[day.date][0].MATUTINO.rolito"
                          >
                          </tabla-celda>
                        </td>
                      </tr>
                      <tr>
                        <td>Barra vespertino</td>
                        <td>
                          <tabla-celda
                            :value="produccion[day.date][0].VESPERTINO.barra"
                          >
                          </tabla-celda>
                        </td>
                      </tr>
                      <tr>
                        <td>Rolito vespertino</td>
                        <td>
                          <tabla-celda
                            :value="produccion[day.date][0].VESPERTINO.rolito"
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
    produccion: [],
    topics: ['Kilos', 'Productividad', 'Captura App', 'Km x litro'],
  }),
  async created() {
    this.weekDays = getWeekDays(this.fecha);
    const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=ventas`, { fecha: this.fecha, suc: this.suc });
    this.ventas = response.data;
    const rProduccion = await axios.post(`${env.REPORTES_CONCENTRADO}?option=produccion`, { fecha: this.fecha, suc: this.suc });
    this.produccion = rProduccion.data;
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
    }
  },
  components: {
    'tabla-celda': tablaCeldaVue,
  },
}
</script>

<style lang="scss" scoped>

</style>