<template>
  <div id="modalManufacturaGeneral" class="modal modal-manufacturaGeneral">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <br v-if="!isLoaded">
    <progress-indicator :show="!isLoaded"></progress-indicator>
    <div v-if="isLoaded">
    <div class="modal-header">
          <div class="modal-header-titulo">
            <!-- <div class="valor">{{dirManufactura}}</div> -->
            <div class="titulo">NOMBRE DIRECTOR MANUFACTURA</div>
          </div>
          <div class="modal-header-titulo border-around">
            <div class="valor">{{"Todas"}}</div>
            <div class="titulo">SUCURSALES</div>
          </div>
          <div class="modal-header-titulo">
            <!-- <div class="valor">{{comision*100}}%</div> -->
            <div class="titulo">% COMISION</div>
          </div>
        </div>
      <div class="modal-content">
        <div class="flex-column">
          <div class="modal-manufacturaGeneral-card">
            <v-wrapper
                titulo="Rendimiento de Luz"
                :porcentaje="datosLuz[index].porcentaje"
              >
            </v-wrapper>
            <v-wrapper
                titulo="Rendimiento de Agua"
                :porcentaje="datosAgua[index].porcentaje"
                :puntos="puntosRendimientoAgua"
              >
            </v-wrapper>
            <v-wrapper
                titulo="KG Barra Producidos"
                :valor="datosProduccionG[index].barra.Acumulado| number"
                :porcentaje="datosProduccionG[index].barra.Tendencia | number"
              >
            </v-wrapper>
            <v-wrapper
              titulo="Kg Rolito Producidos"
              :valor="datosProduccionG[index].rolito.Acumulado| number"
              :porcentaje="datosProduccionG[index].rolito.Tendencia | number"
            ></v-wrapper>
            <v-wrapper
              titulo="Kg Total Producidos"
              :valor="datosProduccionG[index].real| number"
              :porcentaje="datosProduccionG[index].porcentaje| number"
              :puntos="puntosProduccion"
            ></v-wrapper>
            <!-- <v-wrapper
              titulo="Kg Total Producidos"
              :valor="datos | number"
            ></v-wrapper> -->
          </div>
          <div class="modal-manufacturaGeneral-card ">
            <v-wrapper
              titulo="Puntos Acumulados"
              :valor="totalPuntos"
            ></v-wrapper>
            <v-wrapper
              titulo="Comisión"
              :valor="comision_total| money"
            ></v-wrapper>
            <v-wrapper
              titulo="Compensación Variable"
              :valor="compensacionVariable | money"
            ></v-wrapper>
            <v-wrapper
              titulo="Nómina base"
              :valor="sueldo_base | money"
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
import vWrapperVue from '../concentrado-ventas/v-wrapper.vue';
export default {
  name: 'modal-manufacturaGeneral',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    index:Number,
    fecha: String,
    onClose: Function,
  },
  data: ()=>({
    isLoaded: false,
    // dirManufacturaGeneral: '',
    sueldo_base: 5000,
    comision: 0,
    puntos: {},
    comisionVenta: 3000,
    datos:{},
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
      const puntos =  Math.round(eficiencia * 100, 2) / 100;
      return Number(puntos > this.puntos[name] ? this.puntos[name] : puntos);
    },
    async onModalOpen() {
      // await this.fetchAdminInfo();
      await this.fetchAllData();
      this.isLoaded = true;
    },
    // async fetchAdminInfo() {
    //   const response = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=getDetalleManufacturaGeneral`, {
    //     fecha: this.fecha,  weeks: this.weeks.index,suc: this.suc
    //   });
    //   const {
    //     dirManufacturaGeneral, sueldo_base, comision, puntos,
    //     } = response.data;
    //   this.dirManufacturaGeneral = dirManufactura;
    //   this.sueldo_base = sueldo_base;
    //   this.comision = comision;
    //   this.puntos = puntos;
    // },
    async fetchAllData(){
      const rData = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=manufacturaGeneral`, { fecha: this.fecha });
      this.datos = rData.data;
      this.datosProduccionG= Object.values(this.datos['ProduccionGeneral']);
      this.datosLuz= Object.values(this.datos['RendimientoLuz']);
      this.datosAgua= Object.values(this.datos['RendimientoAgua']);
      this.puntos=this.puntos =  this.datos.puntos;
      // console.log(this.puntos =  this.datos.puntos);
    },
  },
  mounted() {
    M.Modal.init(document.getElementById('modalManufacturaGeneral'), {
      onCloseEnd: this.onModalClose,
    });
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById('modalManufacturaGeneral')).open()
        this.onModalOpen();
      } else {
        M.Modal.getInstance(document.getElementById('modalManufacturaGeneral')).close()
      }
    },
  },
  computed: {
    puntosRendimientoAgua() {
      if(this.getPuntos(this.datosAgua[this.index].porcentaje, 'Rendimiento Agua') >= 0){
        return this.getPuntos(this.datosAgua[this.index].porcentaje, 'Rendimiento Agua');
      }
      return 0;
    },
    puntosProduccion() {
      if(this.getPuntos(this.datosProduccionG[this.index].porcentaje, 'Produccion') >= 0){
        return this.getPuntos(this.datosProduccionG[this.index].porcentaje, 'Produccion');
      }
      return 0;
    },
    totalPuntos() {
      const puntos = 
      this.puntosRendimientoAgua +
      this.puntosProduccion;
      return Math.round(puntos*10)/10;
    },
    compensacionVariable() {
      const electrica = this.datosLuz[this.index].porcentaje
      if(electrica > 90) {
        return Math.round(this.comisionVenta * this.totalPuntos/100);
      }
      return 0;
    },
    comision_total() {
      return this.comisionVenta;
      // return this.valores.real * this.comision;
    },
    total() {
      if (this.datosLuz[this.index].porcentaje  > 90) {
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
  .modal-manufacturaGeneral {
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
    .modal-manufacturaGeneral-card {
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