<template>
  <div>
    <div class="rutas-info-bar">
      <rutas-info-title>
        <h5>Frecuencias</h5>
      </rutas-info-title>
      <div class="rutas-info">
        <div class="input-field m-0">
          <select v-model="routeSelected">
            <option value="" disabled selected>Escoge una ruta</option>
            <option v-for="route in routes" :value="route.id" :key="route.id">{{route.name}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="rutas-container">
      <frecuencia-menu :route="routeSelected" :suc="suc"></frecuencia-menu>
      <div class="rutas-body">
        <div class="rutas-map">
          <frecuencias-map ></frecuencias-map>
        </div>
        <div class="map-footer">
          <map-footer suc="SUC04"></map-footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapInfoVue from '../map-info.vue';
import RutasInfoTitleVue from '../rutas-info-title.vue';
import FrecuenciasMenuVue from './frecuencia-menu.vue';
import FrecuenciasMapVue from './frecuencias-map.vue';

export default {
  name: 'default',
  props: ['suc'],
  data: () => ({
    routeSelected: '',
    routes: [],
  }),
  components: {
    'rutas-info-title': RutasInfoTitleVue,
    'frecuencia-menu': FrecuenciasMenuVue,
    'frecuencias-map': FrecuenciasMapVue,
    'map-footer': MapInfoVue,
  },
  async created() {
    const response = await axios.post(`${env.RUTAS_FRECUENCIAS_API_URL}?option=getRoutes`, { suc: this.suc });
    this.routes = response.data;
  },
  updated() {
    M.FormSelect.init(document.querySelectorAll('select'));
  },
}
</script>

<style lang="scss">
  .rutas-info {
    .input-field {
      width: 250px;
    }
    .select-dropdown.dropdown-trigger {
      margin: 0;
    }
  }
</style>
