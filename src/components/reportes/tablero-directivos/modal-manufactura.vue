<template>
  <div id="modalManufactura" class="modal modal-manufactura">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <progress-indicator :show="!isLoaded"></progress-indicator>
    <div v-if="isLoaded">
      <div class="modal-header">
          <div class="modal-header-titulo">
            <div class="valor">{{admin}}</div>
            <div class="titulo">NOMBRE DEL SUPERVISOR</div>
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
        <div class="modal-manufactura-card">
          <div class="wrapper">
            <div class="titulo"><span>RENDIMIENTO DE LUZ</span></div>
            <div class="valor">
              <!-- <span :class="getClass(getPorcentaje(week['Rendimiento luz']))">{{getPorcentaje(week['Rendimiento luz'])}}%</span> -->
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo"><span>RENDIMIENTO DE AGUA</span></div>
            <div class="valor">
              <!-- <span :class="getClass(getPorcentaje(week['Rendimiento agua']))">{{getPorcentaje(week['Rendimiento agua'])}}%</span> -->
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo"><span>KG BARRA PRODUCIDOS</span></div>
            <div class="valor">
              <!-- <span>{{week.Produccion.barra.Acumulado | number}} Kg.</span> -->
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo"><span>KG ROLITO PRODUCIDOS</span></div>
            <div class="valor">
              <!-- <span>{{week.Produccion.rolito.Acumulado | number}} Kg.</span> -->
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo">KG TOTAL PRODUCIDOS</div>
            <div class="valor">
              <!-- <span>{{week.Produccion.real | number}} Kg.</span> -->
            </div>
          </div>
        </div>
        <div class="modal-manufactura-card ">
          <div class="wrapper">
            <div class="titulo"><span>PUNTOS ACUMULADOS</span></div>
            <div class="valor">
              <!-- <span>{{sueldo_base | money}}</span> -->
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo"><span>COMISIÓN</span></div>
            <div class="valor">
              <span>{{ getPorcentaje(valores.meta, valores.real) > 80 >0 ? comision_total : 0  | money}}</span>
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
</template>
<script>
export default {
  name: 'modal-manufactura',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    weeks: Object,
    valores: Object,
    index:Number,
    suc: String,
    fecha: String,
    onClose: Function,
  },
  data: ()=>({
    isLoaded: false,
    admin: '',
    sueldo_base: 0,
    comision: 0,
    puntos: {},
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
    getPorcentaje(weeks) {
      const {real, meta} = weeks;
      return meta > 0 ? Math.floor(real/meta) : 0;
    },
    getPuntos(porcentaje, name) {
      const eficiencia = porcentaje * this.puntos[name] / 100;
      return Math.round(eficiencia * 100, 2) / 100;
    },
    async onModalOpen() {
      await this.fetchAdminInfo();
      await this.fetchAllData();
      this.isLoaded = true;
    },
    async fetchAdminInfo() {
      const response = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=getDetalleAdministrativo`, {
        fecha: this.fecha,  weeks: this.weeks.index,suc: this.suc
      });
      const {
        admin, sueldo_base, comision, camionetas, puntos
        } = response.data;
      this.admin = admin;
      this.sueldo_base = sueldo_base;
      this.comision = comision;
      this.puntos = puntos;
    },
    async fetchAllData(){
      const rData = await axios.post(`${env.REPORTES_CONCENTRADO}?option=gerente`, { fecha: this.fecha, suc: this.suc });
      this.datos = rData.data;
    },
  },
  mounted() {
    M.Modal.init(document.getElementById('modalManufactura'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalManufactura')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalManufactura')).close()
      }
    },
  },
  computed: {
    puntosRendimientoAgua() {
      return this.getPuntos(89, 'Rendimiento Agua');
    },
    comision_total() {
      return this.valores.real * this.comision;
    },
    total() {
        return this.sueldo_base;
    }
  }
}
</script>

<style lang="scss" scoped>
  .modal-manufactura {
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
    .modal-manufactura-card {
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