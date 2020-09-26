import Vue from 'vue';
import axios from 'axios';
import M from 'materialize-css';
// bootstrap configuration
window.axios = axios;
window.M = M;
// Filtros
Vue.filter('money', function (value) {
  if(!Number(value)) return value;
  if (!value) return '$0'
  return '$'+(new Intl.NumberFormat("en-US").format(value));
})
Vue.filter('number', function (value) {
  if(!Number(value)) return value;
  if (!value) return 0;
  return new Intl.NumberFormat("es-MX").format(value);
})
// Vue components
Vue.component('vue-button', require('./button.vue').default)
Vue.component('confirm-modal', require('./components/common/confirm-modal.vue').default)
Vue.component('day-check', require('./components/evalLimpieza/day-check.vue').default)
Vue.component('eval-aspectos-limpieza', require('./components/evalLimpieza/index.vue').default)
Vue.component('bitacora-merma', require('./components/bitacora-merma/index.vue').default)
Vue.component('merma-input', require('./components/bitacora-merma/merma-input.vue').default)
Vue.component('comisiones-produccion', require('./components/comisiones-produccion/comisiones.vue').default)
// -- Configuracion --
Vue.component('conf-turnos', require('./components/configuracion/turnos/index.vue').default)
Vue.component('turno-empleado', require('./components/configuracion/turnos/turno-empleado.vue').default)
Vue.component('turno-timer', require('./components/configuracion/turnos/timer.vue').default)
Vue.component('variables-comisiones-produccion', require('./components/comisiones-produccion/variables.vue').default)
Vue.component('comisiones-produccion', require('./components/comisiones-produccion/comisiones.vue').default)
// --Fallas produccion--
Vue.component('fallas-produccion', require('./components/produccion/fallas.vue').default);
// -- Produccion --
Vue.component('gestion-tanque', require('./components/produccion/gestion-tanque.vue').default);
Vue.component('v-produccion', require('./components/produccion/index.vue').default);
Vue.component('mapa-tanques', require('./components/tanques/index.vue').default);
// -- arqueo --
Vue.component('v-arqueo', require('./components/arqueo/index.vue').default);
Vue.component('frecuencia-unidades', require('./components/reportes/frecuencias/unidades.vue').default);
Vue.component('frecuencia-sucursales', require('./components/reportes/frecuencias/sucursales.vue').default);

Vue.component('panel-tabla', require('./components/arqueo/panel-table.vue').default);

var app = new Vue({
  el: '#app',
})

// init sidebar
M.Sidenav.init(document.querySelectorAll('.sidenav'),);
M.Collapsible.init(document.querySelectorAll('.collapsible'),);
