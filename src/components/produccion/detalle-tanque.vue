<template>
  <div>
    <div v-if="!isLoaded" class="center">
      <br>
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoaded">
      <v-tanque
        :filas="detalleTanque.n_filas"
        :columnas="detalleTanque.n_columnas"
        :canastillas="detalleTanque.n_canastillas"
        :deshabilitadas="blackList"
        :descompuestas="cajonesDeshabilitados"
        :selecteable="true"
        :on-click="clickHandler"
        :tanque="tanque"
        :descompuestos-clikable="false"
      >
      </v-tanque>
    </div>
  </div>
</template>
<script>
import vTanqueVue from '../tanques/v-tanque.vue';

export default {
  props: ['tanque', 'onClick'],
  data() {
    return {
      isLoaded: false,
      detalleTanque: null,
      blackList: [],
      cajonesDeshabilitados: [],
    };
  },
  async created() {
    const response = await axios.post(`${env.TANQUE_PRODUCCION}?option=getDetalleTanque`, { idTanque: this.tanque.idMaquinas });
    const res = await axios.post(`${env.TANQUE_PRODUCCION}?option=getCeldasBloqueadas`, { idTanque: this.tanque.idMaquinas });
    const cajonesDeshabilitadosResponse = await axios.post(`${env.TANQUE_PRODUCCION}?option=getCajonesDeshabilitados`, { idTanque: this.tanque.idMaquinas });
    const [tanque] = response.data;
    this.detalleTanque = tanque;
    this.blackList = res.data;
    this.cajonesDeshabilitados = cajonesDeshabilitadosResponse.data;
    this.isLoaded = true;
  },
  methods: {
    numberToLetter(number) {
      if (Math.floor(number / 26) > 0) {
        return numberToLetter(number/26) + String.fromCharCode(65+(number % 26));
      }
      return String.fromCharCode(64 + number);
    },
    clickHandler(fila, col) {
      const filaCol = { columna: col, fila, canastillas: this.detalleTanque.n_canastillas};
      this.onClick(filaCol);
    }
  },
  components: {
    'v-tanque': vTanqueVue,
  }
}
</script>
<style lang="scss" scoped>
  .tanque {
    border: 2px solid;
    border-radius: 5px;
    background: transparent;
    padding: 10px;
    padding-top: 20px;
      &__row {
      box-sizing: border-box;
      margin-bottom: 20px;
      display: flex;
      width: 100%;
      border-radius: 5px;
      justify-content: space-around;
      & > .columna-tanque {
        margin-left: 20px;
      }
    }
  }
  .cell-indicator {
    font-weight: bold;
  }
  .abosolute-vertical-center {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .position-relative {
    position: relative;
  }
</style>
