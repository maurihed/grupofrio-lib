<template>
  <div class="rutas-menu" :class="{'d-none': !isMenuOpen}">
    <div class="p-1" v-if="frecuencias.length">
      <day-list :frecuencias="frecuencias"></day-list>
    </div>
    <div v-if="!frecuencias.length" class="center">
      <h6 class="text-bold">Selecciona una ruta</h6>
    </div>
  </div>
</template>
<script>
import DayListVue from './day-list.vue';
import { FrecuenciaDay } from './models/FrecuenciaDay';

  export default {
    name: 'frecuencia-menu',
    props: ['route', 'suc'],
    data: () => ({
      frecuencias: [],
    }),
    computed: {
      isMenuOpen() {
        return this.$store.state.isMenuOpen;
      }
    },
    methods: {
      async handleChange(marker, day, isChecked) {
        const { clave } = marker.info;
        await axios.post(`${env.RUTAS_FRECUENCIAS_API_URL}?option=updateFrecuencia`, { clave, day, checked: isChecked });
      }
    },
    watch: {
      async route() {
        if (this.route) {
          const response = await axios.post(`${env.RUTAS_FRECUENCIAS_API_URL}?option=getClients`, { route: this.route, suc: this.suc });
          this.frecuencias = Object.values(response.data).map(day => new FrecuenciaDay(day, this.handleChange.bind(this)));
          this.$store.dispatch('RESET_ROUTES');
          this.$store.dispatch('SET_FRECUENCIAS', this.frecuencias);
        }
      }
    },
    components: {
      'day-list': DayListVue,
    }
  }
</script>
<style lang="scss" scoped>

</style>
