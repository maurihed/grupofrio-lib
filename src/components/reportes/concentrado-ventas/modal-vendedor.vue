<template>
  <div id="modalVendedor" class="modal modal-vendedor">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <progress-indicator :show="!isLoaded"></progress-indicator>
    <div v-if="isLoaded">
      <div class="modal-header">
          <div class="modal-header-titulo">
            <div class="valor">{{vendedor.nombre}}</div>
            <div class="titulo">NOMBRE DEL VENDEDOR</div>
          </div>
          <div class="modal-header-titulo border-around">
            <div class="valor">{{vendedor.camioneta}}</div>
            <div class="titulo">UNIDAD</div>
          </div>
          <div class="modal-header-titulo">
            <div class="valor">{{comision*100}}%</div>
            <div class="titulo">% COMISIÓN</div>
          </div>
        </div>
      <div class="modal-content">
        <div class="modal-vendedor-card">
          <div class="card-titulos">
            <div class="titulo">IMPORTE VENDIDO</div>
            <div class="titulo">KILOS VENDIDOS</div>
            <div class="titulo">PRODUCTIVIDAD</div>
            <div class="titulo">CAPTURA APP</div>
          </div>
          <div class="card-valores">
            <div class="valor">{{importeVendido | money}}</div>
            <div class="valor">
              <span>{{kilosVendidos.real | number}}</span>
              <span>{{getPorcentaje(kilosVendidos.real, kilosVendidos.meta)}} %</span>
            </div>
            <div class="valor">
              <span>{{productividad}}</span>
            </div>
            <div class="valor">
              <span>{{capturaApp}}</span>
            </div>
          </div>
        </div>
        <div class="modal-vendedor-card">
          <div class="card-titulos">
            <div class="titulo">RENDIMIENTO</div>
            <div class="titulo">KM RECORIDOS</div>
            <div class="titulo">COMBUSTIBLE</div>
          </div>
          <div class="card-valores">
            <div class="valor">{{rendimiento}}</div>
            <div class="valor">
              <span>{{kgRecorridos | number}} KM</span>
            </div>
            <div class="valor">
              <span>{{combustible | money}}</span>
            </div>
          </div>
        </div>
        <div class="modal-vendedor-card">
          <div class="card-titulos">
            <div class="titulo">CLIENTES POR RECUPERAR</div>
            <div class="titulo">CLIENTES POR COMPETENCIA</div>
          </div>
          <div class="card-valores">
            <div class="valor">
              <span>{{recuperados.length | number}}</span>
            </div>
            <div class="valor">
              <span>{{competencia.length | number}}</span>
            </div>
          </div>
        </div>
        <div class="modal-vendedor-card">
          <div class="card-titulos">
            <div class="titulo">NÓMINA BASE</div>
            <div class="titulo">COMISIÓN</div>
            <div class="titulo">COMISIÓN CLIENTES</div>
          </div>
          <div class="card-valores">
            <div class="valor">
              <span>{{sueldo_base | money}}</span>
            </div>
            <div class="valor">
              <span>{{comision_total | money}}</span>
            </div>
            <div class="valor">
              <span>{{comision_cliente | money}}</span>
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
  name: 'modal-vendedor',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    fecha: String,
    vendedor: Object,
    onClose: Function,
    kilosVendidos: Object,
    productividad: String,
    capturaApp: String,
    suc: String,
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
  }),
  methods: {
    onModalClose() {
      this.isLoaded = false;
      this.onClose();
    },
    async onModalOpen() {
      if(this.vendedor) {
        await Promise.allSettled([
          await this.fetchKmInfo(),
          await this.fetchVenta(),
          await this.fetchVariablesVendedor(),
          await this.fetchClientesRecuperados(),
        ]);
        this.isLoaded = true;
      } else {
        this.onClose();
      }
    },
    async fetchKmInfo() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=kmInfo`, {
        fecha: this.fecha, vendedor: this.vendedor.clave, camioneta: this.vendedor.camioneta,
      });
      const {kilometraje, combustible, rendimiento} = response.data;
      this.kgRecorridos = kilometraje || 0;
      this.rendimiento = rendimiento || 0;
      this.combustible = combustible || 0;
    },
    async fetchVenta() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=getVentaSemanalVendedor`, {
        fecha: this.fecha, vendedor: this.vendedor.clave, suc: this.suc,
      });
      const {real} = response.data;
      this.importeVendido = real || 0;
      this.importeVendido = Math.round(this.importeVendido);
    },
    async fetchVariablesVendedor() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=getVariablesVendedor`, { vendedor: this.vendedor.clave });
      const {sueldo_base, comision} = response.data;
      this.sueldo_base = Math.round(sueldo_base*1000)/1000;
      this.comision = Math.round(comision*1000)/1000;
    },
    async fetchClientesRecuperados() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=getClientesRecuperados`, { vendedor: this.vendedor.clave, fecha: this.fecha });
      const {recuperados, competencia} = response.data;
      this.recuperados = recuperados;
      this.competencia = competencia;
    },
    getPorcentaje(real, meta) {
      return meta > 0 ? Math.round((real/meta)*100, 2) : 0;
    }
  },
  mounted() {
    M.Modal.init(document.getElementById('modalVendedor'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalVendedor')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalVendedor')).close()
      }
    },
  },
  computed: {
    comision_total() {
      const kilos = this.getPorcentaje(this.kilosVendidos.real, this.kilosVendidos.meta);
      const productividad = this.productividad.slice(0,-2);
      const capturaApp = this.capturaApp.slice(0,-2);
      if(kilos >= 89 && productividad >= 89 && capturaApp >= 89) {
        return Math.round(this.importeVendido * this.comision, 2);
      }
      return 0;
    },
    comision_cliente() {
      const recumerados = this.recuperados.reduce((total, item)=> total+Number(item.vendido),0);
      const competencia = this.competencia.reduce((total, item)=> total+Number(item.vendido),0);
      return Math.round(recumerados*.02 + competencia*.03,2);
    },
    total() {
      return Math.round(this.sueldo_base+this.comision_total+this.comision_cliente-this.combustible, 2);
    }
  },
}
</script>

<style lang="scss" scoped>
  .modal-vendedor {
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
      flex-wrap: wrap;
    }
    .modal-vendedor-card {
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