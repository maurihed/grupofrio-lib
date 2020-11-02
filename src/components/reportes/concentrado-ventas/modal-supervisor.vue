<template>
  <div id="modalSupervisor" class="modal modal-supervisor">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <progress-indicator :show="!isLoaded"></progress-indicator>
    <div v-if="isLoaded">
      <div class="modal-header">
          <div class="modal-header-titulo">
            <div class="valor">{{supervisor}}</div>
            <div class="titulo">NOMBRE DEL SUPERVISOR</div>
          </div>
          <div class="modal-header-titulo border-around">
            <div class="valor">{{camionetas}}</div>
            <div class="titulo">UNIDADADES</div>
          </div>
          <div class="modal-header-titulo">
            <div class="valor">{{comision*100}}%</div>
            <div class="titulo">% COMISIÓN</div>
          </div>
        </div>
      <div class="modal-content">
        <div class="modal-supervisor-card">
          <div class="wrapper">
            <div class="titulo"><span>IMPORTE VENDIDO</span></div>
            <div class="valor">
              <span>{{week.Ingresos.real | money}}</span>
              <span>{{week.Ingresos.porcentaje}}%</span>
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo">KILOS VENDIDOS</div>
            <div class="valor">
              <span>{{week.Kilos.real | money}}</span>
              <span>{{week.Kilos.porcentaje}}%</span>
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo">PRODUCTIVIDAD</div>
            <div class="valor">
              <span>{{week.Productividad.real | number}}</span>
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo">CAPTURA APP</div>
            <div class="valor">
              <span>{{week['Captura App'].real}}</span>
            </div>
          </div>
        </div>
        <div class="modal-supervisor-card">
          <div class="wrapper">
            <div class="titulo"><span>CLIENTES POR RECUPERAR</span></div>
            <div class="valor">
              <span>{{recuperados | number}}</span>
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo"><span>CLIENTES POR COMPETENCIA</span></div>
            <div class="valor">
              <span>{{competencia | number}}</span>
            </div>
          </div>
        </div>
        <div class="modal-supervisor-card">
          <div class="wrapper">
            <div class="titulo"><span>RENDIMIENTO UNIDADES</span></div>
            <div class="valor">
              <span>{{rendimiento}} Km/Lts.</span>
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo"><span>KM RECORRIDOS</span></div>
            <div class="valor">
              <span>{{kgRecorridos | number}} KM</span>
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo">COMBUSTIBLE</div>
            <div class="valor">
              <span>{{combustible | money}}</span>
            </div>
          </div>
        </div>
        <div class="modal-supervisor-card">
          <div class="wrapper">
            <div class="titulo"><span>NÓMINA BASE</span></div>
            <div class="valor">
              <span>{{sueldo_base | money}}</span>
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo"><span>COMISIÓN</span></div>
            <div class="valor">
              <span>{{week.Kilos.porcentaje > 89 ? comision_total : 0 | money}}</span>
            </div>
          </div>
          <div class="card-button">
            <div class="titulo">TOTAL A PAGAR</div>
            <div class="valor bold">{{total | money}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modal-supervisor',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    week: Object,
    suc: String,
    fecha: String,
    onClose: Function,
  },
  data: ()=>({
    isLoaded: false,
    kgRecorridos: 0,
    rendimiento: 0,
    combustible: 0,
    importeVendido: 0,
    sueldo_base: 0,
    comision: 0,
    recuperados: 0,
    competencia: 0,
    camionetas: 0,
  }),
  methods: {
    onModalClose() {
      this.isLoaded = false;
      this.onClose();
    },
    async onModalOpen() {
      await this.fetchSupervisorInfo();
      this.isLoaded = true;
    },
    async fetchSupervisorInfo() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=infoSupervisor`, {
        fecha: this.fecha, suc: this.suc, week: this.week.index
      });
      const {
        camionetas,
        gastado,
        kilometraje,
        litros,
        rendimiento,
        supervisor,
        recuperados,
        competencia,
        sueldo_base,
        comision
      } = response.data;
      this.camionetas = camionetas;
      this.kgRecorridos = kilometraje;
      this.combustible = gastado;
      this.rendimiento = rendimiento;
      this.supervisor = supervisor;
      this.recuperados = recuperados;
      this.competencia = competencia;
      this.sueldo_base = sueldo_base;
      this.comision = comision;
    },
  },
  mounted() {
    M.Modal.init(document.getElementById('modalSupervisor'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalSupervisor')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalSupervisor')).close()
      }
    },
  },
  computed: {
    comision_total() {
      return this.week.Ingresos.real * this.comision;
    },
    total() {
      if (this.week.Kilos.porcentaje > 89) {
        return Math.round(this.sueldo_base+this.comision_total, 2);
      }
      return this.sueldo_base;
    }
  },
}
</script>

<style lang="scss" scoped>
  .modal-supervisor {
    border: 2px solid #2d3a8d;
    border-radius: 10px;
    overflow: hidden !important;
    min-height: 360px;
    align-items: center;
    .modal-header {
      background: #bfc7da;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      .modal-header-titulo {
        padding: 0 30px;
        .valor {
          text-align: center;
          color: #2d3a8d;
          font-weight: bold;
          font-family: axiforma bold;
        }
        .titulo {
          text-align: center;
          color: #FFF;
          font-weight: bold;
          font-family: axiforma bold;
          font-size: .8rem;
        }
      }
      .border-around {
        border-left: 2px solid #95a3bf;
        border-right: 2px solid #95a3bf;
      }
    }
    .modal-content {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      max-height: 300px;
    }
    .wrapper {
      display: flex;
      width: 100%;
      color: #2d3a8d;
      font-family: axiforma bold;
      .titulo {
        width: 55%;
        justify-content: flex-end;
        display: flex;
        align-items: center;
        span {
          text-align: right;
        }
      }
      .valor {
        font-weight: bold;
        min-width: 135px;
        padding-left: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .modal-supervisor-card {
      border: 3px solid #2d3a8d;
      background: #F3F7FF;
      padding: 0;
      border-radius: 10px;
      width: 48%;
      margin: 1%;
      display: flex;
      flex-wrap: wrap;
      .card-titulos {
        width: 55%;
        color: #2d3a8d;
        text-align: right;
        margin-right: 5%;
        .titulo {
          width: 100%;
          text-align: right;
          flex: 1;
          display: block;
        }
      }
      .card-valores {
        width: 40%;
        color: #2d3a8d;
        text-align: left;
        font-family: axiforma bold;
        font-weight: bold;
        .valor span {
          margin-right: 1rem;
        }
      }
      .card-button {
        width: 100%;
        background: #dfe8f7;
        border-top: 3px solid #2e3b8d;
        border-radius: 0 0px 10px 10px;
        display: flex;
        justify-content: space-around;
        padding: .5rem;
        color: #2d3a8d;
        .bold {
          font-weight: bold;
          font-family: axiforma bold;
        }
      }
    }
  }
</style>