<template>
  <div id="modalMaquinas" class="modal modal-maquinas">
    <div class="modal-content">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <progress-indicator :show="!isLoaded"></progress-indicator>
      <div class="maquinasContainer">
        <div class="mItem border-right-1">
          <div v-for="item in primeraParte" :key="item.Nombre" class="maquina">
            <span>{{item.Nombre}}</span>
            <span class="status" :class="{bueno: item.evaluaciones, malo: !item.evaluaciones}"></span>
          </div>
        </div>
        <div class="mItem">
          <div v-for="item in segundaParte" :key="item.Nombre" class="maquina">
            <span>{{item.Nombre}}</span>
            <span class="status" :class="{bueno: item.evaluaciones, malo: !item.evaluaciones}"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-maquinas',
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
    primeraParte: [],
    segundaParte: [],
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
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=detalleMaquinas`, { suc: this.suc, fecha: this.fecha, turno: this.turno });
      let maquinasEvaluadas = response.data;
      if(maquinasEvaluadas){
        maquinasEvaluadas = maquinasEvaluadas.map(m => ({...m, evaluaciones: Number(m.evaluaciones) > 0}));
        this.primeraParte = maquinasEvaluadas.slice(0, maquinasEvaluadas.length/2);
        this.segundaParte = maquinasEvaluadas.slice(maquinasEvaluadas.length/2,maquinasEvaluadas.length);
      }
    }
  },
  mounted() {
    M.Modal.init(document.getElementById('modalMaquinas'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalMaquinas')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalMaquinas')).close()
      }
    },
  },
}
</script>

<style lang="scss">
.modal-maquinas {
  border: 2px solid #2d3a8d;
  border-radius: 10px !important;
  overflow: hidden !important;
  min-height: 180px;
  align-items: center;
  .modal-content {
    margin: 0;
    padding: 1rem !important;
  }

  .maquinasContainer {
    display: flex;
    .mItem {
      width: 50%;
    }
    div.maquina {
      color: #2d3a8d;
      font-weight: bold;
      font-family: axiforma bold;
      text-transform: uppercase;
      justify-content: flex-end;
      align-items: center;
      display: flex;
      padding: .5rem 2rem .5rem 1rem;
      .status {
        margin-left: 2rem
      }
    }
  }
  .border-right-1 {
    border-right: 1px solid #e1e0e5;
  }
  .status {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #0f0;
    &.malo {
      border: 2px solid #e47b77;
      background: #fedede;
    }
    &.bueno {
      border: 2px solid #4dc4a3;
      background: #d3fff1;
    }
  }
  .contents {
    display: contents;
  }
}
</style>