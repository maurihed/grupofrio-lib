import Vue from 'vue';
import axios from 'axios';
import M from 'materialize-css';
// bootstrap configuration
window.axios = axios;
window.M = M;
// Init custom elements
M.AutoInit();
// Vue components
Vue.component('vue-button', require('./button.vue').default)
Vue.component('confirm-modal', require('./components/common/confirm-modal.vue').default)
Vue.component('day-check', require('./components/evalLimpieza/day-check.vue').default)
Vue.component('eval-aspectos-limpieza', require('./components/evalLimpieza/index.vue').default)

var app = new Vue({
  el: '#app',
})

// console.log(env);