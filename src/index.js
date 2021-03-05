import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import M from 'materialize-css';
import { store } from './store/index';
// bootstrap configuration
window.axios = axios;
window.M = M;

// store config
Vue.use(Vuex);
const Store = new Vuex.Store(store);
// Filtros
Vue.filter('money', function (value) {
  if(isNaN(Number(value))) return value;
  if (!value) return '$0'
  return '$'+(new Intl.NumberFormat("en-US").format(value));
});

Vue.filter('percentage', function (value) {
  if(isNaN(Number(value))) return value;
  const number = new Intl.NumberFormat("es-MX").format(value);
  return `${number} %`; 
});

Vue.filter('number', function (value) {
  if(!Number(value)) return value;
  if (!value) return 0;
  return new Intl.NumberFormat("es-MX").format(value);
})
Vue.filter('hour', function (value) {
  if (!value) return '';
  const [hours, minutes] = value.split(':');
  const meridian = hours < 12 ? 'AM': 'PM'; 
  let hour = hours%12;
  hour = hour == 0 ? 12 : hour;
  return `${hour}:${minutes} ${meridian}`;
})
// Vue components
Vue.component('vue-button', require('./button.vue').default)
Vue.component('progress-indicator', require('./components/common/progress-indicator.vue').default)
Vue.component('confirm-modal', require('./components/common/confirm-modal.vue').default)
Vue.component('day-check', require('./components/evalLimpieza/day-check.vue').default)
Vue.component('eval-aspectos-limpieza', require('./components/evalLimpieza/index.vue').default)
Vue.component('bitacora-merma', require('./components/bitacora-merma/index.vue').default)
Vue.component('merma-input', require('./components/bitacora-merma/merma-input.vue').default)
Vue.component('comisiones-produccion', require('./components/comisiones-produccion/comisiones.vue').default)
Vue.component('search-select', require('./components/common/search-select.vue').default)

// -- Configuracion --
Vue.component('conf-turnos', require('./components/configuracion/turnos/index.vue').default)
Vue.component('variables-vendedores', require('./components/configuracion/varaiblesVendedores/index.vue').default)
Vue.component('turno-empleado', require('./components/configuracion/turnos/turno-empleado.vue').default)
Vue.component('turno-timer', require('./components/configuracion/turnos/timer.vue').default)
Vue.component('variables-comisiones-produccion', require('./components/comisiones-produccion/variables.vue').default)
Vue.component('comisiones-produccion', require('./components/comisiones-produccion/comisiones.vue').default)
Vue.component('turnos-variables', require('./components/configuracion/turnos-variables/index.vue').default)
// --Fallas produccion--
Vue.component('fallas-produccion', require('./components/produccion/fallas.vue').default);
// -- Produccion --
Vue.component('gestion-tanque', require('./components/produccion/gestion-tanque.vue').default);
Vue.component('v-produccion', require('./components/produccion/index.vue').default);
Vue.component('mapa-tanques', require('./components/tanques/index.vue').default);
Vue.component('mapa-tanque', require('./components/tanques/mapa-tanques.vue').default);
// -- arqueo --
Vue.component('v-arqueo', require('./components/arqueo/index.vue').default);
Vue.component('frecuencia-unidades', require('./components/reportes/frecuencias/unidades.vue').default);
Vue.component('frecuencia-sucursales', require('./components/reportes/frecuencias/sucursales.vue').default);
Vue.component('panel-tabla', require('./components/arqueo/panel-table.vue').default);
// reportes
Vue.component('concentrado-ventas', require('./components/reportes/concentrado-ventas/index.vue').default);
Vue.component('tablero-directivos', require('./components/reportes/tablero-directivos/index.vue').default);
Vue.component('reporte-cliente', require('./components/reportes/clientes/index.vue').default);
// Kpis
Vue.component('crud-kpis', require('./components/kpis/index.vue').default);
Vue.component('v-porcentaje', require('./components/reportes/concentrado-ventas/v-porcentaje.vue').default);
Vue.component('v-porcentajeGastos', require('./components/reportes/concentrado-ventas/v-porcentajeGastos.vue').default);

// rutas
Vue.component('rutas-clientes', require('./components/rutas/index.vue').default);
Vue.component('v-map', require('./components/rutas/v-map.vue').default);
Vue.component('map-footer', require('./components/rutas/map-info.vue').default);
Vue.component('rutas-menu', require('./components/rutas/rutas-menu.vue').default);
Vue.component('rutas-info-title', require('./components/rutas/rutas-info-title.vue').default);
//frecuencias
Vue.component('frecuencia-clientes', require('./components/rutas/frecuencias/index.vue').default);
//
var app = new Vue({
  el: '#app',
  store: Store,
})

// init sidebar
M.Sidenav.init(document.querySelectorAll('.sidenav'),);
M.Collapsible.init(document.querySelectorAll('.collapsible'),);
M.Dropdown.init(document.querySelectorAll('.menu-dropdown-name'),{
  coverTrigger: false,
  inDuration: 0,
  outDuration: 0,
});
