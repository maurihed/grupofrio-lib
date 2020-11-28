<template>
  <div id="modalComercial" class="modal modal-comercial">
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
        <div class="modal-comercial-card">
          <div class="wrapper">
            <div class="titulo"><span>PRODUCTIVIDAD</span></div>
            <div class="valor">
              <span >{{valores.real}}</span>
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo"><span>IMPORTE VENDIDO</span></div>
            <div class="valor">
              <!-- <span>{{datos.Ingresos| money}}</span> -->
              <!-- <span>{{weeks| money}}</span> -->
              <!-- <span>{{datos.Ingresos[index].real| money}}</span> -->
              <!-- <span :class="getClass(week.Ingresos.porcentaje)">{{week.Ingresos.porcentaje}}%</span> -->
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo">KILOS VENDIDOS</div>
            <div class="valor">
              <!-- <span>{{week.Kilos.real | money}}</span> -->
              <!-- <span :class="getClass(week.Kilos.porcentaje)">{{week.Kilos.porcentaje}}%</span> -->
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo">EFECTIVIDAD</div>
            <div class="valor">
              <!-- <span>{{week.Productividad.real | number}}</span> -->
              <!-- <span :class="getClass(week.Productividad.porcentaje)">{{week.Productividad.porcentaje}}%</span> -->
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo">MERMA VENTA 2 %</div>
            <div class="valor">
              <!-- <span>{{week['Captura App'].real}}</span> -->
              <!-- <span :class="getClass(week['Captura App'].porcentaje)">{{week['Captura App'].porcentaje}}%</span> -->
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo">COMBUSTIBLE</div>
            <div class="valor">
              <!-- <span>{{week['Captura App'].real}}</span> -->
              <!-- <span :class="getClass(week['Captura App'].porcentaje)">{{week['Captura App'].porcentaje}}%</span> -->
            </div>
          </div>
        </div>
        <div class="modal-comercial-card ">
          <div class="wrapper">
            <div class="titulo"><span>PUNTOS ACUMULADOS</span></div>
            <div class="valor">
              <!-- <span>{{sueldo_base | money}}</span> -->
            </div>
          </div>
          <div class="wrapper">
            <div class="titulo"><span>COMISIÓN</span></div>
            <div class="valor">
              <span>{{ getPorcentaje(valores.meta, valores.real) >80 ? comision_total : 0  | money}}</span>
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
  name: 'modal-comercial',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    weeks: Object,
    valores: Object,
    suc: String,
    fecha: String,
    index:Number,
    onClose: Function,
  },
  data: ()=>({
    isLoaded: false,
    admin: '',
    sueldo_base: 0,
    comision: 0,
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
    // async conversionIndex() {
    //   if(index == 0){
    //     index = 'Semana 45'
    //   }
    // },
    async onModalOpen() {
      await this.fetchAdminInfo();
      await this.fetchAllData();
      // await this.conversionIndex();
      this.isLoaded = true;
    },
    async fetchAdminInfo() {
      const response = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=getDetalleAdministrativo`, {
        fecha: this.fecha,weeks: this.weeks.index, suc: this.suc,
      });
      const {admin, sueldo_base, comision} = response.data;
      this.admin = admin;
      this.sueldo_base = sueldo_base;
      this.comision = comision;
    },
    async fetchAllData(){
      const rData = await axios.post(`${env.REPORTES_CONCENTRADO}?option=gerente`, { fecha: this.fecha, suc: this.suc });
      this.datos = rData.data;
    },
  },
  mounted() {
    M.Modal.init(document.getElementById('modalComercial'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalComercial')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalComercial')).close()
      }
    },
  },
  computed: {
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
  .modal-comercial {
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
    .modal-comercial-card {
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