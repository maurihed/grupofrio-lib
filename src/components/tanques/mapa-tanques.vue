<template>
<div>
  <span v-if="!isLoaded">Loading...</span>
  <div class="row" v-if="isLoaded">
    <div class="col s12" v-for="tanque in tanques" :key="tanque.id">
      <div v-if="Number(getColumnas(tanque))">
        <div class="mapaTanque__header">
          <h4>{{tanque.Nombre}}</h4>
        </div>
        <div class="tanque">
          <div v-for="col in (Number(getColumnas(tanque)) + 1)" :key="col" :class="{ 'num-col': col === 1, 'col': col > 1 }">
            <div v-if="col > 1" class="col-header">{{numberToLetter(col - 1)}}</div>
            <col-num v-if="col === 1" :filas="getFilas(tanque)"></col-num>
            <div v-if="col !== 1">
              <div v-for="fila in Number(getFilas(tanque))" :key="fila">
                <div class="canastilla" :class="{'disponible': checkCell(tanque.celdas_scadas, fila, col - 1)}">
                      <span
                        class="canastilla__text"
                        v-if="checkCell(tanque.celdas_scadas, fila, col - 1)"
                      >
                      {{ getUltimaSacada(tanque.celdas_scadas, fila, col - 1).hora | hora }}
                      </span>
                      <span class="text-circle circle" v-if="checkCell(tanque.celdas_scadas, fila, col - 1)">
                        {{ getUltimaSacada(tanque.celdas_scadas, fila, col - 1).position }}
                      </span>
                  <div v-for="celda in Number(getCanastillas(tanque))" class="celda" :key="celda"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import vTanqueVue from './v-tanque.vue';
import { numberToLetter } from '../../assets/js/utilities';
import colNumVue from './col-num.vue';
import colTanqueVue from './col-tanque.vue';
export default {
  name: 'mapa-tanque',
  props: ['suc', 'fecha'],
  data: () => ({
    tanques: null,
    isLoaded: false,
  }),
  methods: {
    getTanqueDetalles(tanque) {
      return tanque.detalles[0] || {};
    },
    getFilas(tanque) {
      return this.getTanqueDetalles(tanque).n_filas || 0;
    },
    getColumnas(tanque) {
      return this.getTanqueDetalles(tanque).n_columnas || 0;
    },
    getCanastillas(tanque) {
      return this.getTanqueDetalles(tanque).n_canastillas || 0;
    },
    numberToLetter(v) { 
      return numberToLetter(v);
    },
    checkCell(canastillas, fila, col) {
      return !!canastillas.find(c => c.fila == fila && c.columna == col);
    },
    getUltimaSacada(canastillas, fila, col) {
      canastillas = canastillas
        .sort((cellA, cellB) => Date.parse(new Date(cellA.hora_sacado)) - Date.parse(new Date(cellB.hora_sacado)))
        .map((cell, index) => ({...cell, position: index+1}));
      const { hora_sacado: hora, position } = canastillas.find(c => c.fila == fila && c.columna == col);
      return { hora, position };
    },
  },
  async created() {
    const response = await axios.post(`${env.TANQUE_PRODUCCION}?option=detalleTanquesFecha`, { suc: this.suc, fecha: this.fecha });
    this.tanques = response.data;
    this.isLoaded = true;
  },
  filters: {
    hora(f) {
      if(!f) {
        return '';
      }
      const d = new Date(f);
      const hour = d.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const minutes = String(d.getMinutes());
      const seconds = String(d.getSeconds());
      return `${String(hour % 12 || 12).padStart(2, '0')}:${minutes.padStart(2,'0')}:${seconds.padStart(2,'0')} ${ampm}`;
    }
  },
  components: {
    'col-num': colNumVue,
    'col-tanque': colTanqueVue
  },
}
/**
"id": "3",
  "tanque_id": "176",
  "n_filas": "17",
  "n_columnas": "2",
  "n_canastillas": "8",
  "tipo_barras": "75"
 */
</script>
<style lang="scss" scoped>
.mapaTanque__header {
    text-align: center;
    color: #2e3b8d;
    border-bottom: 3px solid #88a0c2;
    margin-bottom: 20px;
}
.transparent {
  background: transparent;
}
.text-circle {
  background: #00823c;
  color: #F0F0F0 !important;
  padding: 0 4px;
  position: absolute;
  right: 5px;
  color: black;
  overflow: hidden;
  padding: 0 10px;
  top: 50%;
  transform: translateY(-50%);
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
  .canastilla {
    width: 100%;
    margin-bottom: 20px;
    background: #8da0bc;
    border-radius: 5px;
    display: flex;
    padding: 5px;
    position: relative;
    &.disponible {
    background: #00813d;
    .celda {
      background: #01c149;
    }
    .canastilla__text {
        color: #000;
        font-weight: bold;
        background: none;
      }
  }
    .canastilla__text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: black;
      text-overflow: ellipsis;
      overflow: hidden;
      widows: 100%;
      padding: 0 .9rem;
      border-radius: 5px;
    }
    .celda {
      margin: 0 3px;
      height: 24px;
      flex: 1;
      display: flex;
      justify-content: space-around;
      border-radius: 5px;
      background: #cbd1e1;
    }
  }
}
</style>