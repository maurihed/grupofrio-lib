<template>
<div>
  <div class="mapaTanque__header">
    <h4>{{tanqueObj.Nombre}}</h4>
  </div>
  <div class="tanque">
    <div v-for="col in (Number(detalleTanque.n_columnas) + 1)" :key="col" :class="{ 'num-col': col === 1, 'col': col > 1 }">
      <div v-if="col > 1" class="col-header">{{numberToLetter(col - 1)}}</div>
      <col-num v-if="col === 1" :filas="detalleTanque.n_filas"></col-num>
      <col-tanque
        v-if="col > 1"
        :filas="Number(detalleTanque.n_filas)"
        :col="col-1"
        :descompuestas="cajonesDeshabilitados"
        :deshabilitadas="blackList"
        :celdas="Number(detalleTanque.n_canastillas)"
        :on-click="canastillaClick"
        :selectable="false"
      ></col-tanque>
    </div>
  </div>
</div>
</template>
<script>
import { numberToLetter } from '../../assets/js/utilities.js';
import timerVue from '../configuracion/turnos/timer.vue';
import colNumVue from './col-num.vue';
import colTanqueVue from './col-tanque.vue';

export default {
  props: ['tanque'],
  data() {
    return {
      detalleTanque: {
        n_columnas: 0,
        n_filas: 0,
        n_canastillas: 0,
      },
      tanqueObj: {},
      blackList: [],
      cajonesDeshabilitados: [],
    };
  },
  async created() {
    const tanque = JSON.parse(this.tanque);
    this.tanqueObj = tanque;
    const response = await axios.post(`${env.TANQUE_PRODUCCION}?option=getDetalleTanque`, { idTanque: tanque.idMaquinas });
    const res = await axios.post(`${env.TANQUE_PRODUCCION}?option=getCeldasBloqueadas`, { idTanque: tanque.idMaquinas });
    const cajonesDeshabilitadosResponse = await axios.post(`${env.TANQUE_PRODUCCION}?option=getCajonesDeshabilitados`, { idTanque: tanque.idMaquinas });
    this.blackList = res.data;
    this.cajonesDeshabilitados = cajonesDeshabilitadosResponse.data;
    this.detalleTanque = response.data[0];
  },
  methods:{
    numberToLetter(v) { 
      return numberToLetter(v);
    },
    canastillaClick(fila, col) {
      console.log('top side', fila, col)
    },
  },
  components: {
    'col-num': colNumVue,
    'col-tanque': colTanqueVue,
  }
}
</script>
<style lang="scss">
.mapaTanque__header {
    text-align: center;
    color: #2e3b8d;
    border-bottom: 3px solid #88a0c2;
    margin-bottom: 20px;
}
.tanque {
  display: flex;
  justify-content: space-between;
  .num-col {
    width: 40px;
    font-size: 1.5rem;
    line-height: 35px;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding-top: 45px;
    color: #828388;
    font-weight: bold;;
    div {
      margin-bottom: 20px;
    }
    .col-header {
      color: #828388;
      font-weight: bold;;
    }
  }
  .col {
    width: 100%;
    font-size: 1.4rem;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 1rem;
    margin: 0 1rem;
    background: #e6eaf3;
  }
}
</style>