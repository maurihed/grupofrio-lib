<template>
  <div id="modalAdministrativoGeneral" class="modal modal-administrativoGeneral">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <progress-indicator :show="!isLoaded"></progress-indicator>
    <div v-if="isLoaded">
      <div class="modal-header">
          <div class="modal-header-titulo">
            <div class="valor">{{mesNombre}}</div>
          </div>
          <div class="modal-header-titulo border-around">
            <div class="valor">{{"Todas"}}</div>
            <div class="titulo">SUCURSALES</div>
          </div>
          <div class="modal-header-titulo">
            <div class="valor">{{" "}}</div>
        </div>
      </div>
      <div class="modal-content">
        <div class="flex-column">
          <div class="modal-administrativoGeneral-card">
            <v-wrapper
                titulo="Costos"
                :valor="costos.real| money"
                :porcentajeGastos="getPorcentaje(costos.meta, costos.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Gastos Fijos"
                :valor="gastosFijos.real| money"
                :porcentajeGastos="getPorcentaje(gastosFijos.meta, gastosFijos.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Gastos de Operación"
                :valor="gastosOperativos.real| money"
                :porcentajeGastos="getPorcentaje(gastosOperativos.meta, gastosOperativos.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="  Planta"
                :valor="planta.real| money"
                :porcentajeGastos="getPorcentaje(planta.meta, planta.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Distribución"
                :valor="distribucion.real| money"
                :porcentajeGastos="getPorcentaje(distribucion.meta, distribucion.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Administrativos"
                :valor="administrativos.real| money"
                :porcentajeGastos="getPorcentaje(administrativos.meta, administrativos.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Gastos Financieros"
                :valor="financieros.real| money"
                :porcentajeGastos="getPorcentaje(financieros.meta, financieros.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Gastos Impuestos"
                :valor="impuestos.real| money"
                :porcentajeGastos="getPorcentaje(impuestos.meta, impuestos.real)"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Gastos Totales"
                :valor="real| money"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Presupuesto Total"
                :valor="meta| money"
                :porcentajeGastos="getPorcentaje(meta,real)"
              >
            </v-wrapper>
            <br><br>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vWrapperVue from '../concentrado-ventas/v-wrapper.vue';

export default {
  name: 'modal-administrativoGeneral',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    fecha: String,
    mesNombre: String,
    onClose: Function,
  },
  data: ()=>({
    isLoaded: false,
    real: 0,
    meta: 0,
    suc:'',
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
      return meta > 0 ? Math.trunc((real/meta)*100):0;
    },
    async onModalOpen() {
      await this.gastosMesAdministrativo();
      await this.gastos();
      this.isLoaded = true;
    },
    async gastosMesAdministrativo() {
      const response = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=gastosMesAdministrativo`, {
        fecha: this.fecha,
      });
      const {real, meta} = response.data;
      this.real = real;
      this.meta = meta;
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
    },
  },
  mounted() {
    M.Modal.init(document.getElementById('modalAdministrativoGeneral'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalAdministrativoGeneral')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalAdministrativoGeneral')).close()
      }
    },
  },
  components: {
    'v-wrapper': vWrapperVue,
  }
}
</script>

<style lang="scss" scoped>
  .modal-administrativoGeneral {
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
    .modal-administrativoGeneral-card {
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