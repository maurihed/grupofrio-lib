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
            <div class="valor">{{dirComercial}}</div>
            <div class="titulo">NOMBRE DEL DIRECTOR</div>
          </div>
          <div class="modal-header-titulo border-around">
            <!-- <div class="valor">{{camionetas}}</div> -->
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
          <div class="modal-comercial-card">
            <v-wrapper
              titulo="Productividad"
              :porcentaje="datosProductividad[index].porcentaje"
              >
            </v-wrapper>
            <v-wrapper
              titulo="Importe Vendido"
              :valor="datosIngresos[index].real| money"
              :porcentaje="datosIngresos[index].porcentaje"
              :puntos="puntosImporte"
              >
            </v-wrapper>
            <v-wrapper
              titulo="Kilos Vendidos"
              :valor="datosKilos[index].real| money"
              :porcentaje="datosKilos[index].porcentaje"
              :puntos="puntosKilos"
              >
            </v-wrapper>
            <v-wrapper
              titulo="Efectividad"
              :porcentaje="datosEfectividad[index].porcentaje"
              >
            </v-wrapper>
            <v-wrapper
              titulo="Merma venta 2 %"
              :valor="mermaVenta.real| number"
              :porcentaje="mermaVenta.porcentaje"
              :puntos="puntosMermaVenta"
            ></v-wrapper>
            <v-wrapper
              titulo="Combustible"
              :valor="combustible| money"
              :porcentaje="combustiblePromedio"
              :puntos="puntosCombustible"
            >
            </v-wrapper>
          </div>
          <div class="modal-comercial-card ">
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
    dirComercial: '',
    sueldo_base: 0,
    comision: 0,
    mermaVenta: {},
    puntos: {},
    combustiblePromedio: 0,
    combustible: 0,
    comisionVenta: 3000,
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
    getPuntos(porcentaje, name) {
      const eficiencia = porcentaje * this.puntos[name] / 100;
      const puntos =  Math.round(eficiencia * 100, 2) / 100;
      return Number(puntos > this.puntos[name] ? this.puntos[name] : puntos);
    },
    async onModalOpen() {
      await this.fetchdirComercialInfo();
      await this.fetchAllData();
      await this.fetchCombustible();
      await this.fetchMerma();
      // await this.conversionIndex();
      this.isLoaded = true;
    },
    async fetchdirComercialInfo() {
      const response = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=getDetalleComercial`, {
        fecha: this.fecha,weeks: this.weeks.index, suc: this.suc,
      });
      const {dirComercial, sueldo_base, comision, puntos} = response.data;
      this.dirComercial = dirComercial;
      this.sueldo_base = sueldo_base;
      this.comision = comision;
      this.puntos = puntos;
    },
    async fetchAllData(){
      const rData = await axios.post(`${env.REPORTES_CONCENTRADO}?option=gerenteDirectivos`, { fecha: this.fecha, suc: this.suc });
      this.datos = rData.data;
      // console.log(Object.values(this.datos.Ingresos));
      this.datosIngresos = Object.values(this.datos.Ingresos);
      this.datosProductividad = Object.values(this.datos.Productividad);
      this.datosKilos = Object.values(this.datos.Kilos);
      this.datosEfectividad = Object.values(this.datos.Efectividad);
    },
    ///Gerente cedis
    async fetchCombustible() {
      const response = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=getGastoCombustible`, {
        fecha: this.fecha, suc: this.suc, weeks: this.weeks.index
      });
      const {
        gastado, presupuesto, promedio
      } = response.data;
      this.combustible = gastado;
      this.combustiblePromedio = promedio;
    },
    async fetchMerma() {
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=getDetalleGerente`, {
        fecha: this.fecha, suc: this.suc, week: this.weeks.index
      });
      const {
        merma
      } = response.data;
      this.mermaVenta = merma;
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
    puntosImporte() {
      if(this.getPuntos(this.datosIngresos[this.index].porcentaje, 'Importe') >= 0){
        return this.getPuntos(this.datosIngresos[this.index].porcentaje, 'Importe');
      }
      return 0;
    },
    puntosKilos() {
      if(this.getPuntos(this.datosKilos[this.index].porcentaje, 'Kilos') >= 0){
        return this.getPuntos(this.datosKilos[this.index].porcentaje, 'Kilos');
      }
      return 0;
    },
    puntosCombustible() {
      if(this.getPuntos(this.combustiblePromedio, 'Combustible') >= 0){
        return this.getPuntos(this.combustiblePromedio, 'Combustible');
      }
      return 0;
    },
    puntosMermaVenta() {
      const porc= this.mermaVenta.porcentaje;
      if(porc <=2){
        if(this.getPuntos(porc, 'Merma') >= 0){
          return this.getPuntos(100, 'Merma');
        }
      }
      return 0;
    },
    totalPuntos() {
      const puntos = 
      this.puntosImporte +
      this.puntosKilos +
      this.puntosCombustible +
      this.puntosMermaVenta;
      return Math.round(puntos*10)/10;
    },
    compensacionVariable() {
      const productividad = this.datosProductividad[this.index].porcentaje;
      if(productividad > 95) {
        return Math.round(this.comisionVenta * this.totalPuntos/100);
      }
      return 0;
    },
    comision_total() {
      return this.comisionVenta;
      // return this.valores.real * this.comision;
    },
    total() {
      if (this.datosProductividad[this.index].porcentaje > 95) {
        return Math.round(Number(this.sueldo_base)+this.compensacionVariable, 2);
      }
      return Number(this.sueldo_base);
    },
  },
  components: {
    'v-wrapper': vWrapperVue,
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
    }
    .flex-column {
      width: 50%;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
    }
    .modal-comercial-card {
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