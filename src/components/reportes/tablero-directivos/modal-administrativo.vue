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
            <!-- <div class="valor">{{camionetas}}</div> -->
            <div class="titulo">SUCURSALES</div>
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
                titulo="GASTOS TOTALES"
                :valor="valores.real| money"
                :porcentaje="94"
                :puntos="puntosGastosTotales"
              >
            </v-wrapper>
            <v-wrapper
                titulo="PRESUPUESTO TOTAL"
                :valor="valores.meta| money"
                :porcentaje="getPorcentaje(valores.meta, valores.real)"
                puntos="34"
              >
            </v-wrapper>
          </div>
          <div class="modal-administrativo-card ">
            <div class="wrapper">
              <div class="titulo"><span>PUNTOS ACUMULADOS</span></div>
              <div class="valor">
                <!-- <span>{{sueldo_base | money}}</span> -->
              </div>
            </div>
            <div class="wrapper">
              <div class="titulo"><span>COMISIÓN</span></div>
              <div class="valor">
                <span>{{ getPorcentaje(valores.meta, valores.real) == 0 && valores.meta >0 ? comision_total : 0  | money}}</span>
              </div>
            </div>
            <div class="wrapper">
              <div class="titulo"><span>COMPENSACIÓN VARIABLE</span></div>
              <div class="valor">
                <!-- <span>{{week.Kilos.porcentaje > 89 ? comision_total : 0 | money}}</span> -->
              </div>
            </div>
            <div class="wrapper">
              <div class="titulo"><span>NÓMINA BASE</span></div>
              <div class="valor">
                <span>{{sueldo_base | money}}</span>
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
    // suc:valores.name,
    admin: '',
    sueldo_base: 0,
    comision: 0,
    // camionetas: 0,
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
      this.isLoaded = true;
    },
    async fetchAdminInfo() {
      const response = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=getDetalleAdministrativo`, {
        fecha: this.fecha,weeks: this.weeks.index, suc: this.suc,
        // suc: this.suc,
        // fecha: this.fecha, suc: this.suc, week: this.week.index
      });
      const {admin, sueldo_base, comision} = response.data;
      this.admin = admin;
      this.sueldo_base = sueldo_base;
      this.comision = comision;
      // const {admin, sueldo_base, comision, camionetas} = response.data;
      // this.admin = admin;
      // this.sueldo_base = sueldo_base;
      // this.comision = comision;
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
      return 0;
    },
    comision_total() {
      return this.valores.real * this.comision;
    },
    total() {
      // return "OIIOO", this.comision_total;
      // if (
      //   comision_total > 0
      // ) {
      //   return Math.round(this.sueldo_base+this.comision_total, 2);
      // }else{
        return this.sueldo_base;
      // }
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