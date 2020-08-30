import Vue from 'vue';
import axios from 'axios';
import M from 'materialize-css';
// bootstrap configuration
window.axios = axios;
window.M = M;
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

var app = new Vue({
  el: '#app',
})

// console.log(env);