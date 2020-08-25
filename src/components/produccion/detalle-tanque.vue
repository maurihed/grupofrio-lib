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
      <h5 class="center">{{tanque.Nombre}}</h5>
      <div class="tanque">
        <div class="tanque__row">
          <div v-for="c in Number(detalleTanque.n_columnas)" :key="'letter'+c"> <span class="cell-indicator">{{numberToLetter(c)}}</span></div>
        </div>
        <div v-for="f in Number(detalleTanque.n_filas)" :key="f" class="tanque__row">
          <div class="position-relative">
            <span class="cell-indicator abosolute-vertical-center">{{f}}</span>
          </div>
          <columna-tanque
            v-for="c in Number(detalleTanque.n_columnas)" :key="c"
            :canastillas="detalleTanque.n_canastillas"
            :fila="f"
            :columna="c"
            :on-click="clickHandler"
            :blackList="blackList"
          />
        </div>
      </div>
    </div>
    <br>
  </div>
</template>
<script>
import columnaTanqueVue from './columna-tanque.vue';

export default {
  props: ['tanque', 'onClick'],
  data() {
    return {
      isLoaded: false,
      detalleTanque: null,
      blackList: [],
    };
  },
  async created() {
    const response = await axios.post(`${env.TANQUE_PRODUCCION}?option=getDetalleTanque`, { idTanque: this.tanque.idMaquinas });
    const res = await axios.post(`${env.TANQUE_PRODUCCION}?option=getCeldasBloqueadas`, { idTanque: this.tanque.idMaquinas });
    const [tanque] = response.data;
    this.detalleTanque = tanque;
    this.blackList = res.data;
    this.isLoaded = true;
  },
  methods: {
    numberToLetter(number) {
      if (Math.floor(number / 26) > 0) {
        return numberToLetter(number/26) + String.fromCharCode(65+(number % 26));
      }
      return String.fromCharCode(64 + number);
    },
    clickHandler(filaCol) {
      this.onClick(filaCol);
    }
  },
  components: {
    'columna-tanque': columnaTanqueVue,
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
