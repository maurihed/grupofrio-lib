<template>
  <div id="modalAdministrativo" class="modal modal-administrativo">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <progress-indicator :show="!isLoaded"></progress-indicator>
    <div v-if="isLoaded">
      <div class="modal-header">
          <div class="modal-header-titulo">
            <div class="valor">{{admin}}</div>
            <div class="titulo">NOMBRE DEL DIRECTOR</div>
          </div>
          <div class="modal-header-titulo border-around">
            <div class="valor">{{valores.name}}</div>
            <div class="titulo">SUCURSAL</div>
          </div>
          <div class="modal-header-titulo">
            <div class="valor">{{comision*100}}%</div>
            <div class="titulo">% COMISION</div>
          </div>
        </div>
      <div class="modal-content">
        <div class="flex-column">
          <div class="modal-administrativo-card">
            <v-wrapper
                titulo="Costos"
                :valor="costos.real| money"
                :porcentaje="getPorcentaje(costos.meta, costos.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Gastos Fijos"
                :valor="gastosFijos.real| money"
                :porcentaje="getPorcentaje(gastosFijos.meta, gastosFijos.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Gastos de Operación"
                :valor="gastosOperativos.real| money"
                :porcentaje="getPorcentaje(gastosOperativos.meta, gastosOperativos.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="  Planta"
                :valor="planta.real| money"
                :porcentaje="getPorcentaje(planta.meta, planta.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Distribución"
                :valor="distribucion.real| money"
                :porcentaje="getPorcentaje(distribucion.meta, distribucion.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Administrativos"
                :valor="administrativos.real| money"
                :porcentaje="getPorcentaje(administrativos.meta, administrativos.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Gastos Financieros"
                :valor="financieros.real| money"
                :porcentaje="getPorcentaje(financieros.meta, financieros.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Gastos Impuestos"
                :valor="impuestos.real| money"
                :porcentaje="getPorcentaje(impuestos.meta, impuestos.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Gastos Totales"
                :valor="valores.real| money"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Presupuesto Total"
                :valor="valores.meta| money"
                :porcentaje="getPorcentaje(valores.meta, valores.real)"
              >
            </v-wrapper>
            <br><br>
          </div>
          <div class="modal-administrativo-card ">
            <v-wrapper
              titulo="Puntos Acumulados"
              :valor=0
            >
            </v-wrapper>
            <v-wrapper
              titulo="Comisión"
              :valor="comision_total| money"
            >
            </v-wrapper>
            <v-wrapper
              titulo="Compensación Variable"
              :valor="compensacionVariable | money"
            >
            </v-wrapper>
            <v-wrapper
              titulo="Nómina base"
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
import vWrapperVue from '../concentrado-ventas/v-wrapper.vue';

export default {
  name: 'modal-administrativo',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    weeks: Object,
    valores: Object,
    suc: String,
    fecha: String,
    onClose: Function,
  },
  data: ()=>({
    isLoaded: false,
    admin: '',
    sueldo_base: 0,
    comision: 0,
    comisionVenta: 3000,
    costos:0,
    gastosFijos:0,
    distribucion:0,
    administrativos:0,
    financieros:0,
    planta:0,
    financieros:0,
    impuestos:0,
    gastosOperativos:0,
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
    getPorcentaje(meta, real) {
      return meta > 0 ? Math.floor((real/meta)*100):0;
    },
    async onModalOpen() {
      await this.fetchAdminInfo();
      await this.gastos();
      this.isLoaded = true;
      // console.log(this.valores);
    },
    async fetchAdminInfo() {
      const response = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=getDetalleAdministrativo`, {
        fecha: this.fecha,weeks: this.weeks.index, suc: this.suc,
      });
      const {admin, sueldo_base, comision, variable} = response.data;
      this.admin = admin;
      this.sueldo_base = sueldo_base;
      this.comision = comision;
      this.variable = variable;
    },
    async gastos() {
      const response = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=gastosPorCategoria`, {
        fecha: this.fecha,suc: this.suc,
      });
      const {costos, gastosFijos, distribucion, administrativos, planta, financieros, impuestos, gastosOperativos} = response.data;
      this.datos = response.data;
      this.costos = costos;
      this.gastosFijos = gastosFijos;
      this.distribucion = distribucion;
      this.administrativos = administrativos;
      this.planta = planta;
      this.financieros = financieros;
      this.impuestos = impuestos;
      this.gastosOperativos = gastosOperativos;
      // console.log(this.datos);
      // this.costos= Object.values(this.datos['costos']);
      // console.log(this.costos.meta);
    },

  },
  mounted() {
    M.Modal.init(document.getElementById('modalAdministrativo'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalAdministrativo')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalAdministrativo')).close()
      }
    },
  },
  computed: {
    puntosGastosTotales() {
      // return 100;
    },
    totalPuntos() {
      // const puntos = this.puntosGastosTotales;
      // return Math.round(puntos*10)/10;
      return 0;
    },
    compensacionVariable() {
      const presupuesto = this.getPorcentaje(this.valores.meta, this.valores.real)
      if(presupuesto < 100) {
        return Math.round(this.comisionVenta * this.totalPuntos/100);
      }
      return 0;
    },
    comision_total() {
      return this.comisionVenta;
      return this.valores.real * this.comision;
    },
    total() {
      if (this.getPorcentaje(this.valores.meta, this.valores.real) < 100) {
        return Math.round(Number(this.sueldo_base)+this.compensacionVariable, 2);
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
  .modal-administrativo {
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
    .modal-administrativo-card {
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
    // .derecha{
    //   position: absolute;
    // left: 345px;
    // }
    .bueno {
      color: #84d0c1;
    }
    .malo {
      color: #f5b0b6;
    }
    .regular {
      color: #e6c212;
    }
  }
</style>