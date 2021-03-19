<template>
<div>
  <span v-if="!isLoaded">Loading...</span>
  <v-tanque
    v-if="isLoaded"
    :filas="detalleTanque.n_filas"
    :columnas="detalleTanque.n_columnas"
    :canastillas="detalleTanque.n_canastillas"
    :deshabilitadas="deshabilitadas"
    :descompuestas="descompuestas"
    :selecteable="false"
    :on-click="()=>{}"
    :tanque="tanqueObj"
  >
  </v-tanque>
</div>
</template>

<script>
import mapaTanquesVue from '../produccion/mapa-tanques.vue';
import vTanqueVue from './v-tanque.vue';

export default {
  props: ['tanque'],
  data: () => ({
    detalleTanque: {
        n_columnas: 0,
        n_filas: 0,
        n_canastillas: 0,
    },
    tanqueObj: {},
    descompuestas: [],
    deshabilitadas: [],
    isLoaded: false,
  }),
  async created() {
    const tanque = JSON.parse(this.tanque);
    this.tanqueObj = tanque;
    const response = await axios.post(`${env.TANQUE_PRODUCCION}?option=getDetalleTanque`, { idTanque: tanque.idMaquinas });
    const res = await axios.post(`${env.TANQUE_PRODUCCION}?option=getCeldasBloqueadas`, { idTanque: tanque.idMaquinas });
    const cajonesDeshabilitadosResponse = await axios.post(`${env.TANQUE_PRODUCCION}?option=getCajonesDeshabilitados`, { idTanque: tanque.idMaquinas });
    this.deshabilitadas = res.data;
    this.descompuestas = cajonesDeshabilitadosResponse.data;
    this.detalleTanque = response.data[0];
    this.isLoaded = true;
  },
  methods: {
    
  },
  components: {
    'v-tanque': vTanqueVue,
  },
}
</script>

<style>

</style>