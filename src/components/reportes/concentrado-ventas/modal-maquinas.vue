<template>
  <div id="modalMaquinas" class="modal modal-maquinas">
    <div class="modal-content">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <br v-if="!isLoaded">
      <progress-indicator :show="!isLoaded"></progress-indicator>
      <h5 class="center">Maquinas</h5>
      <div class="maquinasContainer">
        <div class="mItem border-right-1">
          <div v-for="item in primeraParte" :key="item.descripcion" class="maquina">
            <span>{{item.descripcion}}</span>
            <span class="status" :class="{bueno: item.evaluaciones, malo: !item.evaluaciones}"></span>
          </div>
        </div>
        <div class="mItem">
          <div v-for="item in segundaParte" :key="item.descripcion" class="maquina">
            <span>{{item.descripcion}}</span>
            <span class="status" :class="{bueno: item.evaluaciones, malo: !item.evaluaciones}"></span>
          </div>
        </div>
      </div>
      <h5 class="center">Rendimiento</h5>
      <div class="maquinasContainer">
        <div class="mItem border-right-1">
          <div v-for="item in rendimiento1" :key="item.descripcion" class="maquina">
            <span>{{item.descripcion}}</span>
            <span class="status" :class="{bueno: item.evaluaciones, malo: !item.evaluaciones}"></span>
          </div>
        </div>
        <div class="mItem">
          <div v-for="item in rendimiento2" :key="item.descripcion" class="maquina">
            <span>{{item.descripcion}}</span>
            <span class="status" :class="{bueno: item.evaluaciones, malo: !item.evaluaciones}"></span>
          </div>
        </div>
      </div>
      <h5 class="center">Limpieza</h5>
      <div class="maquinasContainer">
        <div class="mItem border-right-1">
          <div v-for="item in limpieza1" :key="item.descripcion" class="maquina">
            <span>{{item.descripcion}}</span>
            <span class="status" :class="{bueno: item.evaluaciones, malo: !item.evaluaciones}"></span>
          </div>
        </div>
        <div class="mItem">
          <div v-for="item in limpieza2" :key="item.descripcion" class="maquina">
            <span>{{item.descripcion}}</span>
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
    rendimiento1: [],
    rendimiento2: [],
    limpieza1: [],
    limpieza2: [],
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
      let {maquinas, rendimiento, limpieza} = response.data;
      if(maquinas) {
        maquinas = maquinas.map(m => ({...m, evaluaciones: Number(m.evaluaciones) > 0}));
        this.primeraParte = maquinas.slice(0, maquinas.length/2);
        this.segundaParte = maquinas.slice(maquinas.length/2,maquinas.length);
      }
      if(rendimiento) {
        rendimiento = rendimiento.map(m => ({...m, evaluaciones: Number(m.evaluaciones) > 0}));
        this.rendimiento1 = rendimiento.slice(0, rendimiento.length/2);
        this.rendimiento2 = rendimiento.slice(rendimiento.length/2,rendimiento.length);
      }
      if (limpieza) {
        limpieza = limpieza.map(m => ({...m, evaluaciones: Number(m.noSolucionadas) == 0}));
        this.limpieza1 = limpieza.slice(0, limpieza.length/2);
        this.limpieza2 = limpieza.slice(limpieza.length/2,limpieza.length);
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