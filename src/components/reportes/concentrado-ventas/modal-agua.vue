<template>
  <div id="modalAgua" class="modal modal-agua">
    <div class="modal-content">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <progress-indicator :show="!isLoaded"></progress-indicator>
      <div class="aguaContainer" v-if="isLoaded">
        <div class="aguaRow">
          <div class="aguaCol">
            <div>{{medicionInicial | number}} LTS.</div>
            <div>MEDICIÓN INICIAL</div>
          </div>
          <div class="aguaCol">
            <div>{{mermaAgua | number}} %</div>
            <div>MERMA AGUA</div>
          </div>
        </div>
        <div class="aguaRow">
          <div class="aguaCol">
            <div>{{medicionFinal | number}} LTS.</div>
            <div>MEDICIÓN FINAL</div>
          </div>
          <div class="aguaCol">
            <div>{{litrosConsumidos | number}} LTS.</div>
            <div>LTS CONSUMIDOS</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-agua',
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
    mermaAgua: 0,
    medicionFinal: 0,
    medicionInicial: 0,
    litrosConsumidos: 0,
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
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=detalleAgua`, { suc: this.suc, fecha: this.fecha, turno: this.turno });
      const {
        mermaAgua, consumoMaxAgua, consumoAgua, medicionInicial, medicionFinal,
        } = response.data;
      this.mermaAgua = mermaAgua;
      this.medicionFinal = medicionFinal;
      this.medicionInicial = medicionInicial;
      this.litrosConsumidos = consumoAgua;
    }
  },
  mounted() {
    M.Modal.init(document.getElementById('modalAgua'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalAgua')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalAgua')).close()
      }
    },
  },
}
</script>

<style lang="scss">
.modal-agua {
  border: 2px solid #2d3a8d;
  border-radius: 10px !important;
  overflow: hidden !important;
  min-height: 180px;
  align-items: center;
  .modal-content {
    margin: 0;
    padding: 0 !important;
  }
}
.aguaContainer {
  .aguaRow {
    padding: 1rem;
    display: flex;
    &:first-child {
      border-bottom: 1px solid #95a3bf;
    }
    .aguaCol {
      width: 50%;
      text-align: center;
      &:first-child {
        border-right: 2px solid #95a3bf;
      }
      div {
        color: #95a3bf;
        font-weight: bold;
        font-family: axiforma bold;
        &:first-child {
          margin-bottom: 1rem;
          color: #2e3b8d;
        }
      }
    }
  }
}
</style>