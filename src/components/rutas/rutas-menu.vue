<template>
  <div class="rutas-menu" :class="{'d-none': !isMenuOpen}">
    <div class="p-1">
      <h5 class="route-title">Rutas</h5>
      <route-list :routes="routes"></route-list>
    </div>
  </div>
</template>
<script>
import RouteListVue from './components/route-list.vue';
import { Route } from '../../models/route.js';

export default {
  name: 'rutas-menu',
  props: ['suc'],
  data() {
    return {
      routes: [],
    };
  },
  async created() {
    this.$store.commit('setSuc', this.suc);
    const response = await axios.post(`${env.RUTAS_API_URL}?option=getRoutes`, { suc: this.suc });
    this.routes = response.data.map(route => ({ ...route, checked: false }));
    this.routes = this.routes.map(route => new Route(route, null, this.handleMarkerClick));
    this.$store.dispatch({
      type: 'SET_ROUTES',
      routes: this.routes
    });
  },
  computed: {
    isMenuOpen() {
      return this.$store.state.isMenuOpen;
    }
  },
  components: {
    'route-list': RouteListVue,
  },
  methods: {
    handleMarkerClick({ info: client, isSelected }) {
      this.$store.dispatch(isSelected ? 'ADD_CLIENT' : 'REMOVE_CLIENT', client);
    },
  },
}
</script>

<style lang="scss" scoped>
  .route-title {
    color: #2d3a8d;
    font-weight: bold;
    border-bottom: 2px solid #2d3a8d;
  }
</style>