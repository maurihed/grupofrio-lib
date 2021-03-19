<template>
<div>
  <div class="mapaTanque__header">
    <h4>{{tanque.Nombre}}</h4>
  </div>
  <div class="tanque">
    <div v-for="col in (Number(columnas) + 1)" :key="col" :class="{ 'num-col': col === 1, 'col': col > 1 }">
      <div v-if="col > 1" class="col-header">{{numberToLetter(col - 1)}}</div>
      <col-num v-if="col === 1" :filas="filas"></col-num>
      <col-tanque
        v-if="col > 1"
        :filas="Number(filas)"
        :col="col-1"
        :descompuestas="descompuestas"
        :deshabilitadas="deshabilitadas"
        :celdas="Number(canastillas)"
        :on-click="canastillaClick"
        :selectable="selecteable"
        :descompuestos-clikable="descompuestosClikable"
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
  props: ['tanque', 'filas', 'columnas', 'canastillas', 'deshabilitadas', 'descompuestas', 'selecteable', 'onClick', 'descompuestosClikable'],
  methods:{
    numberToLetter(v) { 
      return numberToLetter(v);
    },
    canastillaClick(fila, col, id) {
      this.onClick(fila, col, id);
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
    line-height: 34px;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding-top: 30px;
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