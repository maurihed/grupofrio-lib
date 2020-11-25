<template>
<div>
  <br>
  <progress-indicator :show="!isLoaded"></progress-indicator>
  <div v-if="isLoaded">
    <div class="row">
      <div class="col s12">
        <div class="card">
          <div class="row mb-0">
            <div class="col s6">
              <div class="custom-card">
                <div class="custom-card-header"><i class="material-icons">attach_money</i> VENTA</div>
                <div class="custom-card-body" v-if="isLoaded">
                  <div class="card-row">
                    <div class="p-1">
                      <div class="mb-1">&nbsp;</div>
                      <div class="center mb-2"><span class="text-bold text-primary">$</span></div>
                      <div class="center"><span class="text-bold text-primary">Kg</span></div>
                    </div>
                    <div class="p-1">
                      <span class="mb-1 w-100 text-bold text-primary">Acumulado</span>
                      <span class="mb-1 w-100 neutro acumulado-text">{{acumulado.Venta.dinero.Acumulado | money}}</span>
                      <span class="w-100 neutro acumulado-text">{{acumulado.Venta.kg.Acumulado | number}}</span>
                    </div>
                    <div class="p-1">
                      <span class="mb-1 w-100 text-bold text-primary">Meta</span>
                      <span class="mb-1 w-100 bueno acumulado-text">{{acumulado.Venta.dinero.Meta | money}}</span>
                      <span class="w-100 bueno acumulado-text">{{acumulado.Venta.kg.Meta | number}}</span>
                    </div>
                    <div class="p-1">
                      <span class="mb-1 w-100 text-bold text-primary">Tendencia</span>
                      <span class="mb-1 w-100 acumulado-text" :class="getStateClass(acumulado.Venta.dinero.Tendencia)">{{acumulado.Venta.dinero.Tendencia | number}}%</span>
                      <span class="w-100 acumulado-text" :class="getStateClass(acumulado.Venta.kg.Tendencia)">{{acumulado.Venta.kg.Tendencia | number}}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col s6">
              <div class="custom-card">
                <div class="custom-card-header"><i class="material-icons">attach_money</i> PRODUCCIÓN</div>
                <div class="custom-card-body" v-if="isLoaded">
                  <div class="card-row">
                    <div class="p-1">
                      <div class="mb-1">&nbsp;</div>
                      <div class="center mb-2"><span class="text-bold text-primary">Barra</span></div>
                      <div class="center"><span class="text-bold text-primary">Rolito</span></div>
                    </div>
                    <div class="p-1">
                      <span class="mb-1 w-100 text-bold text-primary">Acumulado</span>
                      <span class="mb-1 w-100 neutro acumulado-text">{{acumulado.Produccion.barra.Acumulado | number}}</span>
                      <span class="w-100 neutro acumulado-text">{{acumulado.Produccion.rolito.Acumulado | number}}</span>
                    </div>
                    <div class="p-1">
                      <span class="mb-1 w-100 text-bold text-primary">Meta</span>
                      <span class="mb-1 w-100 bueno acumulado-text">{{acumulado.Produccion.barra.Meta | number}}</span>
                      <span class="w-100 bueno acumulado-text">{{acumulado.Produccion.rolito.Meta | number}}</span>
                    </div>
                    <div class="p-1">
                      <span class="mb-1 w-100 text-bold text-primary">Tendencia</span>
                      <span class="mb-1 w-100 acumulado-text" :class="getStateClass(acumulado.Produccion.barra.Tendencia)">{{acumulado.Produccion.barra.Tendencia | number}}%</span>
                      <span class="w-100 acumulado-text" :class="getStateClass(acumulado.Produccion.rolito.Tendencia)">{{acumulado.Produccion.rolito.Tendencia | number}}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col s6">
        <slot></slot>
      </div>
    </div>
    <div class="row">
      <div class="col s12">
        <ul class="collapsible expandable">
          <li>
            <div class="collapsible-header"><span class="line start"></span>EQUIPO &nbsp;<b> COMERCIAL</b> <span class="line"></span> <i class="material-icons mr-0 ml-1 arrow-down-size">arrow_drop_down</i></div>
              <div class="collapsible-body"> 
              <progress-indicator :show="loadingComercial"></progress-indicator>
              <div v-if="!loadingComercial">
                <table>
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th class="cursor-pointer" v-for="(week, index) in getWeeks()" :key="index" >{{week}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(topic, index) in Object.keys(comercial)" :key="'comercial-'+index">
                      <td>{{topic}}</td>
                      <td v-for="(val, index) in Object.values(comercial[topic])" :key="index">
                        <tabla-celda
                          :value="val"
                        >
                        </tabla-celda>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </li>

          <li>
            <div class="collapsible-header"><span class="line start"></span>EQUIPO DE&nbsp;<b> MANUFACTURA</b> <span class="line"></span> <i class="material-icons mr-0 ml-1 arrow-down-size">arrow_drop_down</i></div>
              <div class="collapsible-body"> 
              <progress-indicator :show="loadingManufactura"></progress-indicator>
              <div v-if="!loadingManufactura">
                <table>
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th class="cursor-pointer" v-for="(weeks, index) in getWeeksManufactura()" :key="index" >{{weeks}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(topic, index) in Object.keys(manufactura)" :key="'manufactura-'+index">
                      <td>{{topic}}</td>
                      <td v-for="(val, index) in Object.values(manufactura[topic])" :key="index">
                        <tabla-celda
                          :value="val"
                        >
                        </tabla-celda>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </li>

          <li>
            <div class="collapsible-header"><span class="line start"></span>EQUIPO&nbsp;<b> ADMINISTRATIVO</b> <span class="line"></span> <i class="material-icons mr-0 ml-1 arrow-down-size">arrow_drop_down</i></div>
              <div class="collapsible-body"> 
              <progress-indicator :show="loadingAdministrativo"></progress-indicator>
              <div v-if="!loadingAdministrativo">
                <table>
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th class="cursor-pointer" v-for="(weeks, index) in getWeeksAdministrativo()" :key="index" >{{weeks}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(topic, index) in Object.keys(administrativo)" :key="'administrativo-'+index">
                      <td>{{topic}}</td>
                      <td v-for="(val, index) in Object.values(administrativo[topic])" :key="index">
                        <tabla-celda
                          :value="val"
                        >
                        </tabla-celda>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </li>
        </ul>
        
      </div>
    </div>
  </div>
</div>
</template>

<script>
import tablaCeldaVue from './tabla-celda.vue';
export default {
  name:'tablero-directivos',
  props: ['fecha'],
  data() {
    return {
      fecha: '',
      isLoaded: false,
      loadingComercial: true,
      loadingManufactura: true,
      loadingAdministrativo: true,
      acumulado: {},
    }
  },
  async created() {
    const respuesta = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=acumulado`,{
      fecha: this.fecha
    });
    // this.comercial = respuesta.data;
      this.acumulado = respuesta.data;
      this.isLoaded = true;
      await Promise.allSettled([
      this.fetchComercial(),
      this.fetchManufactura(),
      this.fetchAdministrativo(),
    ]);
  },
  updated() {
      M.Collapsible.init(document.querySelectorAll('.collapsible'));
  },
  methods: {
    async fetchComercial(){
      const rComercial = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=gerente`, { fecha: this.fecha});
      this.comercial = rComercial.data;
      this.loadingComercial=false;
    },
    async fetchManufactura(){
      const rManufactura = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=manufactura`, { fecha: this.fecha});
      this.manufactura = rManufactura.data;
      this.loadingManufactura=false;
    },
    async fetchAdministrativo(){
      const rAdministrativo = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=administrativo`, { fecha: this.fecha});
      this.administrativo = rAdministrativo.data;
      this.loadingAdministrativo=false;
    },
    getWeeks() {
      const [first] = Object.values(this.comercial);
      if (first) {
        return Object.keys(first);
      }
      return [];
    },
    getWeeksManufactura() {
      const [first] = Object.values(this.manufactura);
      if (first) {
        return Object.keys(first);
      }
      return [];
    },
    getWeeksAdministrativo() {
      const [first] = Object.values(this.administrativo);
      if (first) {
        return Object.keys(first);
      }
      return [];
    },
    getStateClass(valor) {
      if(valor > 89) {
        return 'bueno';
      }
      if(valor > 70) {
        return 'regular';
      }
      return 'malo';
    },
  },
  components: {
    'tabla-celda': tablaCeldaVue,
  },
}
</script>
<style lang="scss" scoped>
  .p-1 {
    padding: .25rem;
  }
  .p-2 {
    padding: .5rem;
  }
  .w-100 {
    display: block;
    width: 100%;
  }
  .text-bold {
    font-weight: bold;
  }
  .text-primary {
    color: #2e3b8d;
  }
  .mb-0 {
    margin-bottom: 0 !important;
  }
  .ml-1 {
    margin-left: .25rem;
  }
  .mr-0 {
    margin-right: 0;
  }
  .panel {
    font-size: 0.9rem;
    .diferencia {
      width: 50%;
      border-right: 1px solid gray;
      display: flex;
      justify-content: center;
      align-content: center;
    }
    .status {
      width: 50%;
      display: flex;
      justify-content: center;
      align-content: center;
    }
  }
  .two-cols {
    padding: 0;
    display: flex;
    align-content: center;
    margin: 0;
  }
  .acumuladoContainer {
    padding: 0;
    display: flex;
    justify-content: space-between;
    span {
      width: 33%;
      border-right: 1px solid #cccccc;
      &:last-child{
        border-right: none;
      }
    }
  }
  .card {
    padding: 1rem;
    .custom-card {
      width: 100%;
      border-radius: 5px;
      .custom-card-header {
        background: #2e3b8d;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .custom-card-body {
        background: #ebe9f0;
        padding: .5rem 1rem;
        .card-row {
          display: grid;
          grid-template-columns:
          [name] 13%
          repeat(3, 29%);
          text-align: center;
        }
      }
    }
  }
  .mb-1 {
    margin-bottom: .5rem;
  }
  .mb-2 {
    margin-bottom: .75rem;
  }
  .mb-1 {
    margin-bottom: .5rem;
  }
  .acumulado-text {
    color: #6A6A6A;
    font-family: "axiforma bold";
    font-weight: bold;
  }
  .bueno {
    border: 2px solid #84d0c1;
    background: #c9fef6;
    border-radius: 5px;
  }
  .malo {
    border: 2px solid #f5b0b6;
    background: #ffd7e1;
    border-radius: 5px;
  }
  .regular {
    border: 2px solid #c7cbd0;
    background: #f9f2d0;
    border-radius: 5px;
  }
  .neutro {
    border: 2px solid #c7cbd0;
    border-radius: 5px;
  }
  .collapsible-header {
    color: #2e3b8d;
  }
  
  .line {
    flex-grow: 1;
    margin-top: 10px;
    height: 3px;
    background: #c7cbd0;
    margin-left: 1rem;
    &.start {
      max-width: 50px;
      margin-left: 0;
      margin-right: 1rem;
    }
  }
  .arrow-down-size {
    font-size: 4rem;
    line-height: 1.2rem;
    width: 40px;
  }
  .collapsable-dayName {
    background: #d4dbe3;
    text-align: center;
    padding: 0;
    text-transform: uppercase;
    border: none;
    margin-bottom: .5rem;
    & .dayName {
      padding: 10px 0;
      width: 20%;
      background: #96a7c2;
      color: #FFF;
    }
  }
  li.active {
    & > .collapsable-dayName {
      background: #96a7c2;
      padding: 0;
      text-transform: uppercase;
      margin-bottom: 0;
      & .dayName {
        width: 100%;
        padding: 10px 0;
        background: #96a7c2;
        color: #FFF;
      }
    }
  }
  table {
    border-collapse: collapse;
    background: #e6eaf3;
    thead{
      tr {
        border: none;
        th {
        text-align: center;
        background: #adbacf;
        color: #FFF;
        font-family: "axiforma bold";
        font-weight: bold;
          &:first-child {
            color: #a6afbc;
            background: #e4ebf3;
            font-family: "axiforma bold";
            font-weight: bold;
            width: 20%;
            text-align: center;
            text-transform: uppercase;
          }
        }
      }
    }
    tbody tr td {
      &:first-child {
        background: #f3f4f8;
        color: #b9babe;
        font-family: "axiforma bold";
        font-weight: bold;
        width: 20%;
        text-align: center;
      }
    }

  }
  .collapsible-body {
    padding: 0;
  }
  .title-acumulado {
    text-transform: uppercase;
    color: #FFF;
    height: 42px;
    line-height: 42px;
    text-align: center;
    background: #96a7c2;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>