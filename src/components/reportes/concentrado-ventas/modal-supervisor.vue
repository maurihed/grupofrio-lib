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
        <div class="flex-column">
          <div class="modal-supervisor-card">
            <v-wrapper
              titulo="Productividad"
              valor=""
              :porcentaje="week.Productividad.porcentaje"
            >
            </v-wrapper>
            <v-wrapper
              titulo="Importe vendido"
              :valor="week.Ingresos.real | money"
              :porcentaje="week.Ingresos.porcentaje"
              :puntos="puntosIngresos"
            >
            </v-wrapper>
            <v-wrapper
              titulo="Kilos Vendidos"
              :valor="week.Kilos.real | number"
              :porcentaje="week.Kilos.porcentaje"
              :puntos="puntosKilos"
            >
            </v-wrapper>
            <v-wrapper
              titulo="Captura App"
              :valor="week['Captura App'].real"
              :porcentaje="week['Captura App'].porcentaje"
              :puntos="puntosCapturaApp"
            >
            </v-wrapper>
            <v-wrapper
              titulo="Merma venta"
              :valor="mermaVenta.real"
              :porcentaje="mermaVenta.porcentaje"
              :puntos="puntosMerma"
            >
            </v-wrapper>
          </div>
          <div class="modal-supervisor-card">
            <v-wrapper
              titulo="Clientes por recuperar"
              :valor="recuperados | number"
              :puntos="puntosClientesR"
            >
            </v-wrapper>
            <v-wrapper
              titulo="Clientes por competencia"
              :valor="competencia | number"
            >
            </v-wrapper>
          </div>
        </div>
        <div class="flex-column">
          <div class="modal-supervisor-card">
            <v-wrapper
              titulo="Rendimiento Unidades"
              :valor="rendimiento | number"
              :porcentaje="getPorcentaje(kgRecorridos, rendimiento)"
              unidad="Km/Lts."
              :puntos="puntosRendimiento"
            >
            </v-wrapper>
            <v-wrapper
              titulo="Km recorridos"
              :valor="kgRecorridos | number"
              unidad="Km."
            >
            </v-wrapper>
            <v-wrapper
              titulo="Combustible"
              :valor="combustible | money"
            >
            </v-wrapper>
          </div>
          <div class="modal-supervisor-card">
            <v-wrapper
              titulo="Puntos Acumulados"
              :valor="totalPuntos"
            ></v-wrapper>
            <v-wrapper
              titulo="Comisión venta"
              :valor="comision_total | money"
            >
            </v-wrapper>
            <v-wrapper
              titulo="Compensación variable"
              :valor="compensacionVariable"
            >
            </v-wrapper>
            <v-wrapper
              titulo="Nómina Base"
              :valor="sueldo_base | money"
            >
            </v-wrapper>
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
import vWrapperVue from './v-wrapper.vue';
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
    comisionVenta: 1500,
    mermaVenta: {},
  }),
  methods: {
    onModalClose() {
      this.isLoaded = false;
      this.onClose();
    },
    getClass(porcentaje) {
      if(porcentaje > 89) {
        return 'bueno';
      }
      if(porcentaje > 70) {
        return 'regular';
      }
      return 'malo';
    },
    async onModalOpen() {
      await Promise.all([
        this.fetchSupervisorInfo(),
        this.fetchVentaMerma(),
      ]);
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
    async fetchVentaMerma() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=ventaMermaSemanal`, {
        fecha: this.fecha, suc: this.suc, week: this.week.index
      });
      this.puntos = response.data.puntos;
      this.mermaVenta = response.data.merma;
    },
    getPuntos(porcentaje, name) {
      const eficiencia = porcentaje * this.puntos[name] / 100;
      const puntos = Math.round(eficiencia * 100, 2) / 100;
      return Number(puntos > this.puntos[name] ? this.puntos[name] : puntos);
    },
    getPorcentaje(real, meta) {
      const porcentaje = meta > 0 ? Math.floor(real/meta)*100 : 0;
      return porcentaje < 0 ? 0 : porcentaje > 100 ? 100 : porcentaje;
    }
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
    puntosIngresos () {
      return this.getPuntos(this.week.Ingresos.porcentaje, 'Importe Vendido');
    },
    puntosKilos () {
      return this.getPuntos(this.week.Kilos.porcentaje, 'Kilos Vendidos');
    },
    puntosCapturaApp () {
      return this.getPuntos(this.week['Captura App'].porcentaje, 'Captura app');
    },
    puntosMerma () {
      return this.mermaVenta.porcentaje <= 2 ? this.puntos['Merma venta'] : 0;
    },
    puntosClientesR () {
      return this.recuperados >= 20 ? 15: 0;
    },
    puntosRendimiento () {
      return this.getPuntos(this.getPorcentaje(this.kgRecorridos, this.rendimiento), 'Combustible');
    },
    totalPuntos() {
      const total =  this.puntosIngresos
              + this.puntosKilos
              + this.puntosCapturaApp
              + this.puntosMerma
              + this.puntosClientesR
              + this.puntosRendimiento;
      return Math.round(total*100)/100;
    },
    compensacionVariable() {
      if (this.week.Productividad.porcentaje > 89) {
        return Math.round(this.comisionVenta * this.totalPuntos/100);
      }
      return 0;
    },
    comision_total() {
      return this.comisionVenta;
      return this.week.Ingresos.real * this.comision;
    },
    total() {
      if (this.week.Productividad.porcentaje > 89) {
        return Math.round(Number(this.sueldo_base)+this.comision_total+this.compensacionVariable, 2);
      }
      return Number(this.sueldo_base);
    }
  },
  components: {
    'v-wrapper': vWrapperVue,
  }
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
    }
    .flex-column {
      width: 50%;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
    }
    .modal-supervisor-card {
      border: 3px solid #2d3a8d;
      background: #F3F7FF;
      padding: 0;
      border-radius: 10px;
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