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
            <div class="valor">{{comision ? comision*100 : 0}}%</div>
            <div class="titulo">%COMISIÓN</div>
          </div>
        </div>
      <div class="modal-content">
        <div class="flex-column">
          <div class="modal-vendedor-card">
            <v-wrapper
              titulo="Productividad"
              valor=""
              :porcentaje="getPorcentaje(dataVendedor.productividad.real, dataVendedor.productividad.meta)+''"
              puntos=""
            ></v-wrapper>
            <v-wrapper
              titulo="Efectividad"
              valor=""
              :porcentaje="efectividad"
              :puntos="puntosEfectividad"
            ></v-wrapper>
            <v-wrapper
              titulo="Importe Vendido"
              :valor="importeVendido.real | money"
              :porcentaje="importeVendido.porcentaje"
              puntos=""
            ></v-wrapper>
            <v-wrapper
              titulo="Kilos vendidos"
              :valor="kilosVendidos.real | money"
              :porcentaje="getPorcentaje(kilosVendidos.real, kilosVendidos.meta)"
              :puntos="puntosKilosVendidos"
            ></v-wrapper>
            <v-wrapper
              titulo="Captura app"
              valor=""
              :porcentaje="productividad.substr(0,productividad.length -2)"
              :puntos="puntosCapturaApp+''"
            ></v-wrapper>
            <v-wrapper
              titulo="Merma venta"
              valor="0"
              porcentaje="0"
              puntos="0"
            ></v-wrapper>
          </div>
          <div class="modal-vendedor-card">
            <v-wrapper
              titulo="Clientes por recuperar"
              :valor="recuperados.length"
              porcentaje=""
              :puntos="puntosClientesRecuperados"
            ></v-wrapper>
            <v-wrapper
              titulo="Clientes por competencia"
              :valor="competencia.length"
              porcentaje=""
              puntos=""
            ></v-wrapper>
          </div>
        </div>
        <div class="flex-column">
          <div class="modal-vendedor-card">
            <v-wrapper
              titulo="Rendimiento unidad"
              :valor="rendimiento | number"
              unidades="Km/Lts."
              :porcentaje="getPorcentaje(dataVendedor.kmxlitro.real, dataVendedor.kmxlitro.real)+''"
              :puntos="puntosCombustible+''"
            ></v-wrapper>
            <v-wrapper
              titulo="Km recorridos"
              :valor="kgRecorridos | number"
              unidades="KM"
              porcentaje=""
              puntos=""
            ></v-wrapper>
            <v-wrapper
              titulo="Combustible"
              :valor="combustible | money"
              unidades=""
              porcentaje=""
              puntos=""
            ></v-wrapper>
          </div>
          <div class="modal-vendedor-card">
            <v-wrapper
              titulo="Puntos Acumulados"
              :valor="totalPuntos"
              unidades="Pts"
              porcentaje=""
              puntos=""
            ></v-wrapper>
            <v-wrapper
              titulo="Comisión venta"
              :valor="comisionVenta||0 | money"
              unidades=""
              porcentaje=""
              puntos=""
            ></v-wrapper>
            <v-wrapper
              titulo="Compensación Variable"
              :valor="compensacionVariable | money"
              unidades=""
              porcentaje=""
              puntos=""
            ></v-wrapper>
            <v-wrapper
              titulo="Sueldo base"
              :valor="sueldo_base||0 | money"
              porcentaje=""
              puntos=""
            ></v-wrapper>
            <div class="card-button">
              <div class="titulo">TOTAL A PAGAR</div>
              <div class="valor bold">{{total | money}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vPorcentaje from './v-porcentaje.vue';
import vWrapperVue from './v-wrapper.vue';
export default {
  components: { vPorcentaje },
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
    dataVendedor: Object,
  },
  data: ()=>({
    isLoaded: false,
    kgRecorridos: 0,
    rendimiento: 0,
    combustible: 0,
    importeVendido: {},
    sueldo_base: 0,
    comision: 0,
    recuperados: 0,
    competencia: 0,
    efectividad: 0,
  }),
  updated() {
    console.log(this.dataVendedor);
  },
  methods: {
    getClass(porcentaje) {
      if(porcentaje > 89) {
        return 'bueno';
      }
      if(porcentaje > 70) {
        return 'regular';
      }
      return 'malo';
    },
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
          await this.fetchEfectividad(),
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
      this.importeVendido = response.data;
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
    async fetchEfectividad() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=getEfectividadVendedor`, { vendedor: this.vendedor.clave, fecha: this.fecha, suc: this.suc });
      const { efectividad, puntos } = response.data;
      this.efectividad = efectividad;
      this.puntos = puntos;
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
    comision_cliente() {
      const recumerados = this.recuperados.reduce((total, item)=> total+Number(item.vendido),0);
      const competencia = this.competencia.reduce((total, item)=> total+Number(item.vendido),0);
      return Math.round(recumerados*.02 + competencia*.03,2);
    },
    total() {
      return Math.round((this.sueldo_base?this.sueldo_base:0)+this.compensacionVariable, 2);
    },
    comisionVenta() {
      return Math.round(this.importeVendido.real * this.comision);
    },
    puntosEfectividad() {
      const eficiencia = this.efectividad * this.puntos.Efectividad / 100;
      return Math.round(eficiencia * 100, 2) / 100;
    },
    puntosKilosVendidos() {
      const eficiencia = this.getPorcentaje(this.kilosVendidos.real, this.kilosVendidos.meta) * this.puntos['Kilos vendidos'] / 100;
      return Math.round(eficiencia * 100, 2) / 100;
    },
    puntosCapturaApp() {
      const eficiencia = this.productividad.substr(0,this.productividad.length -2) * this.puntos['Captura app'] / 100;
      return Math.round(eficiencia * 100, 2) / 100;
    },
    puntosCombustible() {
      const eficiencia = this.getPorcentaje(this.dataVendedor.kmxlitro.real, this.dataVendedor.kmxlitro.real) * this.puntos['Combustible'] / 100;
      return Math.round(eficiencia * 100, 2) / 100;
    },
    puntosClientesRecuperados() {
      if (this.recuperados.length >= 5) {
        return 15;
      }
      return 0;
    },
    puntosMermaVenta() {
      return 0;
    },
    totalPuntos() {
      return this.puntosEfectividad
        + this.puntosKilosVendidos
        + this.puntosCapturaApp
        + this.puntosCombustible
        + this.puntosMermaVenta
        + this.puntosClientesRecuperados;
    },
    compensacionVariable() {
      const productividad = this.productividad.slice(0,-2);
      if(productividad >= 89) {
        return Math.round(this.comisionVenta * this.totalPuntos/100);
      }
      return 0;
    }
  },
  components: {
    'v-wrapper': vWrapperVue,
  }
}
</script>

<style lang="scss" scoped>
  .modal-vendedor {
    border: 2px solid #2d3a8d;
    border-radius: 10px;
    overflow: hidden !important;
    min-height: 300px;
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
    }
    .flex-column {
      width: 50%;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
    }
    .modal-vendedor-card {
      border: 3px solid #2d3a8d;
      background: #F3F7FF;
      padding: 0;
      border-radius: 10px;
      width: 95%;
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