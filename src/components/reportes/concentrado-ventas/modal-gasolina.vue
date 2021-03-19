<template>
  <div id="modalGasolina" class="modal modal-gasolina">
    <div class="modal-content">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <progress-indicator :show="!isLoaded"></progress-indicator>
      <div class="gasolinaContainer" v-if="isLoaded">
        <div class="gasolinaRow">
          <div class="gasolinaCol">
            <div>{{km_inicial | number}} Km.</div>
            <div>KILOMETRAJE INICIAL</div>
          </div>
          <div class="gasolinaCol">
            <div>{{gastado | money}}</div>
            <div>IMPORTE COMBUSTIBLE</div>
          </div>
        </div>
        <div class="gasolinaRow">
          <div class="gasolinaCol">
            <div>{{km_final | number}} Km.</div>
            <div>KILOMETRAJE FINAL</div>
          </div>
          <div class="gasolinaCol">
            <div>{{litros | number}} lts.</div>
            <div>LITROS COMBUSTIBLE</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-gasolina',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    fecha: String,
    vendedor: Object,
    onClose: Function,
  },
  data: ()=>({
    isLoaded: false,
    gastado: 0,
    km_final: 0,
    km_inicial: 0,
    litros: 0,
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
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=getDetallesGasolina`, { vendedor: this.vendedor.clave, fecha: this.fecha });
      const { gastado, km_final, km_inicial, litros } = response.data;
      this.gastado = gastado;
      this.km_final = km_final;
      this.km_inicial = km_inicial;
      this.litros = litros;
    }
  },
  mounted() {
    M.Modal.init(document.getElementById('modalGasolina'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalGasolina')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalGasolina')).close()
      }
    },
  },
}
</script>

<style lang="scss">
.modal-gasolina {
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
.gasolinaContainer {
  .gasolinaRow {
    padding: 1rem;
    display: flex;
    &:first-child {
      border-bottom: 1px solid #95a3bf;
    }
    .gasolinaCol {
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