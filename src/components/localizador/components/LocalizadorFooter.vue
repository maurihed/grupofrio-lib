<template>
    <div class="contents">
      <div class="main-footer d-flex">
        <div class="w-20 footer-item localizador-title">
          Última Ubicación
        </div>
        <div class="w-20 footer-item bars d-flex flex-column justify-content-evenly">
          <div class="d-flex justify-content-between">
            <span>Contado:</span>
            <span class="text-bold">{{totalVentas.contado | money}}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>Crédito:</span>
            <span class="text-bold">{{totalVentas.credito | money}}</span>
          </div>
        </div>
        <div class="w-40 footer-item d-flex align-center justify-content-between">
          <div class="d-flex flex-column">
            <div><span>Clientes con venta: </span> <span class="text-bold">{{ visitas.conVenta }}</span></div>
            <div><span>Clientes solo visita: </span> <span class="text-bold">{{ visitas.soloVisita }}</span></div>
            <div><span>Clientes sin visitar: </span> <span class="text-bold">{{ visitas.sinVisitar }}</span></div>
          </div>
          <div class="d-flex flex-column">
            <div><span>Total Clientes: </span> <span class="text-bold">{{nClientes}}</span></div>
            <div><span>Hora de salida: </span> <span class="text-bold">{{ inicioRuta.inicio || '--' | hour }}</span></div>
            <div><span>Hora de venta: </span> <span class="text-bold">{{ inicioRuta.fin || '--' | hour }}</span></div>
          </div>
          <div class="d-flex flex-column">
            <div><span>Kg Vendidos: </span> <span class="text-bold">{{kilosVendidos | number}} Kg.</span></div>
            <button @click="openInventario" class="btn-custom">Inventario</button>
          </div>
        </div>
        <div class="w-20 footer-item d-flex justify-content-around align-center">
          <button @click="openDatePicker()" class="btn-custom">Ruta</button>
          <button class="btn-custom" @click="trackSeller">{{isTraking ? 'Siguiendo' : 'Seguir'}}</button>
          <button class="btn-custom">Finalizar</button>
        </div>
      </div>
      <!-- Modal Structure -->
      <div ref="inventarioModal" class="modal">
        <div class="modal-content">
        <progress-indicator :show="!isLoaded"></progress-indicator>
          <div v-if="isLoaded">
            <h5 class="center primary">Inventario</h5>
            <div class="center" v-if="!inventario.length">
              -- VACIO --
            </div>
            <table v-if="inventario.length">
              <thead>
                <tr>
                  <td>Código</td>
                  <td>Nombre</td>
                  <td>Cantidad</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in inventario" :key="item.CODIGO">
                  <td>{{item.CODIGO}}</td>
                  <td>{{item.NOMBRE}}</td>
                  <td>{{item.CANTIDAD | number}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <input ref="datepicker" type="text" class="hide datepicker">
    </div>
</template>
<script>
import { displayMessage, displayError } from '../../../assets/js/utilities';
import { today } from '../../../assets/js/date-utilities';

export default {
  name: 'localizador-footer',
  data: () => ({
    modalInstance: null,
    datePickerInstance: null,
    isLoaded: false,
    inventorio: [],
    fechas: [],
    features: [],
  }),
  mounted() {
    this.modalInstance = M.Modal.init(this.$refs.inventarioModal);
    this.initDatePicker();
  },
  methods: {
    trackSeller() {
      const action = this.isTraking ? 'UNFOLLOW_VENDEDOR': 'FOLLOW_VENDEDOR';
      this.$store.dispatch(action);
    },
    initDatePicker() {
      if (this.datePickerInstance) {
        this.datePickerInstance.destroy();
      }
      this.fechaSelected = null;
      this.datePickerInstance = M.Datepicker.init(this.$refs.inventarioModal, {
        format: 'yyyy-mm-dd',
        disableDayFn: (date) => !this.fechas.includes(date.toDateString()),
        firstDay: 1,
        i18n: {
          months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
          weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
          cancel: 'Cancelar',
          done: 'Aceptar',
        },
        onOpen: function() {
          displayMessage("Elige el dia para la ruta", 2000, "green");
        },
        onClose: () => {
          const fecha = this.datePickerInstance.toString();
          if (!fecha) {
            // displayError("Debes seleccionar la fecha para continuar");
            return false;
          }
          this.fetchDatosRastreo(fecha);
          this.$store.dispatch('GET_VENDEDOR_INFO', { chofer: this.vendedor.idVendedor, fecha });
          this.$store.dispatch('GET_ROUTE_INFO', { vendedorId: this.vendedor.idVendedor, fecha });
        }
      });
    },
    clearMap() {
      for (let i = 0; i < this.features.length; i++) {
        this.map.data.remove(this.features[i]);
      }
    },
    async openInventario() {
      // getInventario
      this.modalInstance.open();
      this.isLoaded = false;
      const response = await axios.post(`${env.LOCALIZADOR_API}?option=getInventario`, {camioneta: this.vendedor.vehiculo_id});
      this.inventario = response.data;
      this.isLoaded = true;
    },
    async openDatePicker() {
      await this.loadFechasChofer();
      this.initDatePicker();
      this.datePickerInstance.open();
    },
    async loadFechasChofer() {
      const response = await axios.post(`${env.LOCALIZADOR_API}?option=fechasRuta`, {chofer: this.vendedor.idVendedor});
      const arrFechas = response.data;
      this.fechas = arrFechas.map(f => new Date(f.fechaEntrega.replace('-','/')).toDateString());
    },
    async fetchDatosRastreo(fecha) {
      const  params = new URLSearchParams();
      const iconsetngs = {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        strokeWeight: 1,
        fillColor: '#FF0000',
        fillOpacity: 0.5,
        strokeColor: '#FF0000'
      };
      params.append('fecha', fecha);
      params.append('idChofer', this.vendedor.idVendedor);
      const response = await axios.post(`${env.BASE_URL}/controllers/traceDataReader.php`, params);
      const geoJson = response.data;
      if (geoJson === '-1') {
          displayError(`No existen los datos de rastreo para ${fecha}`);
          return;
      }
      if (!geoJson.Error) {
        this.clearMap();
        this.features = this.map.data.addGeoJson(geoJson, null, (respuesta) => {
          this.map.data.setStyle(function(feature) {
            return {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              strokeColor: feature.getProperty('strokeColor'),
              strokeWeight: 3,
              icons: [{
                  icon: iconsetngs,
                  repeat: '100px'
              }]
            }
          });
                // generarPathLinea(respuesta);
                // crearMarcadores(datos);
        });
      }
    },
  },
  computed: {
    totalVentas() {
      return this.$store.state.localizador.totalVentas;
    },
    inicioRuta() {// { inicio, fin }
      return this.$store.state.localizador.inicioRuta;
    },
    visitas() {
      return this.$store.state.localizador.visitas;
    },
    kilosVendidos() {
      return this.$store.state.localizador.kilosVendidos;
    },
    vendedor() {
      return this.$store.state.localizador.vendedor;
    },
    map() {
      return this.$store.state.map;
    },
    isTraking() {
      return this.$store.state.localizador.trankingInfo.isTraking
    },
    nClientes() {
      return this.$store.state.localizador.clientes.length;
    },
  },
}
</script>

<style lang="scss" scoped>
  .contents {
    display: contents;
  }
  .main-footer {
    font-size: 11px;
    box-sizing: border-box;
    height: 100%;
    color: #2d3a8d;
    display: flex;
    .footer-item {
      padding: 0 10px;
      overflow: hidden;
      &.bars {
        border-right: 2px solid #9f9f9f;
        border-left: 2px solid #9f9f9f;
      }
      &.localizador-title {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        &:after {
          position: absolute;
          content: '';
          width: 0;
          height: 0;
          left: 0;
          bottom: 0;
          border-top: 25px solid transparent;
          border-bottom: 25px solid transparent;
          border-left: 25px solid #c2c2c2;
        }
      }
    }
  }
</style>