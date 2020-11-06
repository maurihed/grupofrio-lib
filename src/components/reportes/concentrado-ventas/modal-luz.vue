<template>
  <div id="modalLuz" class="modal modal-luz">
    <div class="modal-content">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <progress-indicator :show="!isLoaded"></progress-indicator>
      <div class="luzContainer" v-if="isLoaded">
        <div class="luzRow">
          <span class="title">MEDICIÓN INICIAL</span>
          <span class="value">{{medicionInicial | number}}</span>
        </div>
        <div class="luzRow">
          <span class="title">MEDICIÓN FINAL</span>
          <span class="value">{{medicionFinal | number}}</span>
        </div>
        <div class="luzRow">
          <span class="title">MULTIPLICADOR</span>
          <span class="value">{{multiplicador | number}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-luz',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    fecha: String,
    suc: String,
    turno: String,
    onClose: Function,
  },
  data: ()=>({
    isLoaded: false,
    multiplicador: 0,
    medicionFinal: 0,
    medicionInicial: 0,
  }),
  methods: {
    onModalClose() {
      this.isLoaded = false;
      this.onClose();
    },
    async onModalOpen() {
      await this.fetchData();
      this.isLoaded = true;
    },
    getPorcentaje(real, meta) {
      return meta > 0 ? Math.round((real/meta)*100, 2) : 0;
    },
    async fetchData() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=detalleLuz`, { suc: this.suc, fecha: this.fecha, turno: this.turno });
      const {
        multiplicador, valor_inicial, valor_final,
        } = response.data;
      this.multiplicador = multiplicador;
      this.medicionFinal = Number(valor_final);
      this.medicionInicial = Number(valor_inicial);
    }
  },
  mounted() {
    M.Modal.init(document.getElementById('modalLuz'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalLuz')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalLuz')).close()
      }
    },
  },
}
</script>

<style lang="scss">
.modal-luz {
  border: 2px solid #2d3a8d;
  border-radius: 10px !important;
  overflow: hidden !important;
  min-height: 180px;
  align-items: center;
  .modal-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 180px;
    margin: 0;
    padding: 0 !important;
  }
  .luzContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px;
    .luzRow {
      display: flex;
      align-items: center;
      font-weight: bold;
        font-family: axiforma bold;
      .title {
        text-align: right;
        width: 50%;
      }
      .value {
        margin-left: 5%;
        text-align: left;
        color: #2e3b8d;
      }
    }
  }
}
</style>