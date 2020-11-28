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
    <ul class="collapsible expandable">
      <li>
        <div class="collapsible-header"><span class="line start"></span>EQUIPO DE &nbsp;<b> VENTAS</b> <span class="line"></span> <i class="material-icons mr-0 ml-1 arrow-down-size">arrow_drop_down</i></div>
          <div class="collapsible-body p-0">
            <progress-indicator :show="loadingVentas"></progress-indicator>
            <div v-if="!loadingVentas">
              <ul class="collapsible expandable">
                <li v-for="(day) in weekDays" :key="day.day">
                  <div class="collapsible-header collapsable-dayName"><span class="dayName center">{{day.dayName}}</span></div>
                  <div class="collapsible-body">
                    <div class="">
                      <table>
                        <thead>
                          <tr>
                            <th>Nombre del vendedor</th>
                            <th
                              class="center"
                              v-for="(topic, index) in topics"
                              :key="index" >{{topic}}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(venta, vendedor) in getVentasRow(day.date)" :key="vendedor">
                            <td>{{vendedor}}</td>
                            <td v-for="(val, index) in Object.values(venta)" :key="index">
                              <tabla-celda
                                :value="val"
                                :realClickHandler="onVendedorRealClick"
                                :fecha="day.date"
                                :vendedor="vendedor"
                                :index-name="index"
                                :cellClickable="[3]"
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
                  <div class="title-acumulado">Acumulado</div>
                  <table>
                    <thead>
                      <tr>
                        <th>Nombre vendedor</th>
                        <th class="center" v-for="(topic, index) in topics" :key="index" >{{topic}}</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(vendedor, index) in getVendedores()" :key="index">
                        <td style="cursor: pointer;" @click="openModal(vendedor)" >{{vendedor}}</td>
                        <td v-for="name in ventasNames" :key="name">
                          <tabla-celda
                            :value="getAcumuladoVenta(vendedor, name)"
                          >
                          </tabla-celda>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              </ul>
            </div>
        </div>
      </li>
      <li>
        <div class="collapsible-header"><span class="line start"></span>EQUIPO DE &nbsp;<b> PRODUCCIÓN</b> <span class="line"></span><i class="material-icons mr-0 ml-1 arrow-down-size">arrow_drop_down</i></div>
        <div class="collapsible-body">
          <progress-indicator :show="loadingProduccion"></progress-indicator>
          <div v-if="!loadingProduccion">
            <ul class="collapsible expandable">
              <li v-for="day in weekDays" :key="day.day">
                <div class="collapsible-header collapsable-dayName"><span class="dayName center">{{day.dayName}}</span></div>
                <div class="collapsible-body">
                  <div class="">
                    <table>
                      <thead>
                        <tr>
                          <th>Turno</th>
                          <th>Barra</th>
                          <th>Rolito</th>
                          <th>Agua</th>
                          <th>Rendimiento energía</th>
                          <th>Mantenimiento</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(prod, turno) in getProduccionRow(day.date)" :key="'prod-'+turno">
                          <td>{{turno.split('-').pop()}}</td>
                          <td v-for="(val, index) in Object.values(prod)" :key="index">
                            <tabla-celda
                              :value="val"
                              :names="Object.keys(prod)"
                              :index-name="index"
                              :realClickHandler="onAguaClick"
                              :fecha="day.date"
                              :turno="turno"
                              :cellClickable="[2,3,4]"
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
                <div class="title-acumulado">Acumulado</div>
                <table>
                  <thead>
                    <tr>
                      <th>Turno</th>
                      <th>Barra</th>
                      <th>Rolito</th>
                      <th>Agua</th>
                      <th>Rendimiento energía</th>
                      <th>Mantenimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(turno, index) in getTurnos()" :key="index">
                      <td style="cursor: pointer;" @click="goToProduccion(turno)">{{turno.split('-').pop()}}</td>
                      <td v-for="name in produccionNames" :key="name">
                        <tabla-celda
                          :value="getAcumuladoProduccion(turno, name)"
                          :name="name"
                        >
                        </tabla-celda>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>
        </div>
      </li>
      <li>
        <div class="collapsible-header"><span class="line start"></span>METAS&nbsp;<b>GERENTE DE PLATA</b> <span class="line"></span><i class="material-icons mr-0 ml-1 arrow-down-size">arrow_drop_down</i></div>
        <div class="collapsible-body"> 
          <progress-indicator :show="loadingGerente"></progress-indicator>
          <div v-if="!loadingGerente">
            <table>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th class="cursor-pointer" @click="openGerenteModal(index)" v-for="(week, index) in getWeeks()" :key="index" >{{week}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(topic, index) in Object.keys(gerente)" :key="'gerente-'+index">
                  <td>{{topic}}</td>
                  <td v-for="(val, index) in Object.values(gerente[topic])" :key="index">
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
        <div class="collapsible-header"><span class="line start"></span>METAS&nbsp;<b>GERENTE DE CEDIS</b> <span class="line"></span><i class="material-icons mr-0 ml-1 arrow-down-size">arrow_drop_down</i></div>
        <div class="collapsible-body"> 
          <progress-indicator :show="loadingGerente"></progress-indicator>
          <div v-if="!loadingGerente">
            <table>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th class="cursor-pointer" @click="openGerenteCedisModal(index)" v-for="(week, index) in getWeeks()" :key="index" >{{week}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(topic, index) in Object.keys(gerente)" :key="'gerente-'+index">
                  <td>{{topic}}</td>
                  <td v-for="(val, index) in Object.values(gerente[topic])" :key="index">
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
        <div class="collapsible-header"><span class="line start"></span>METAS&nbsp;<b>SUPERVISOR DE VENTA</b> <span class="line"></span><i class="material-icons mr-0 ml-1 arrow-down-size">arrow_drop_down</i></div>
        <div class="collapsible-body"> 
          <progress-indicator :show="loadingSupervisor"></progress-indicator>
          <div v-if="!loadingSupervisor">
            <table>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th class="cursor-pointer" @click="openSupervisorModal(index)" v-for="(week, index) in getWeeks()" :key="index" >{{week}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(topic, index) in Object.keys(supervisor)" :key="'supervisor-'+index">
                  <td>{{topic}}</td>
                  <td v-for="(val, index) in Object.values(supervisor[topic])" :key="index">
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
        <div class="collapsible-header" ><span class="line start"></span>METAS&nbsp;<b>ADMINISTRATIVO</b> <span class="line"></span><i class="material-icons mr-0 ml-1 arrow-down-size">arrow_drop_down</i></div>
        <div class="collapsible-body">
          <progress-indicator :show="loadingAdmin"></progress-indicator>
          <div v-if="!loadingAdmin">
            <table>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th v-for="day in weekDays" :key="day.day">{{day.dayName}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(topic, index) in Object.keys(administrativo)" :key="'administrativo-'+index">
                  <td>{{topic}}</td>
                  <td v-for="(val, index) in Object.values(administrativo[topic])" :key="index">
                    <div style="cursor: pointer;" role="button" v-on:click="goToArqueo(val.fecha || '', topic == 'GastosPagos')" class="panel two-cols">
                      <span class="diferencia">{{val.diferencia | number}}</span>
                      <div class="status">
                        <span v-if="val.status"><i class="material-icons indigo-text text-darken-2">check_circle</i></span>
                        <span v-if="!val.status"><i class="material-icons red-text text-darken-2">cancel</i></span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </li>
    </ul>
      <modal-vendedor
        :isOpen="isVendedorModalOpen"
        :vendedor="vendedorSelected"
        :dataVendedor="dataVendedorSelected"
        :kilosVendidos="modalData.kilosVendidos"
        :productividad="modalData.productividad"
        :capturaApp="modalData.capturaApp"
        :fecha="fecha"
        :suc="suc"
        :onClose="onCloseModal"
      >
      </modal-vendedor>
      <modal-gasolina
        :fecha="fechaSelected"
        :vendedor="vendedorSelected"
        :isOpen="isGasolinaModalOpen"
        :onClose="onCloseGasolinaModal"
      >
      </modal-gasolina>
      <modal-supervisor
        :isOpen="isSupervisorModalOpen"
        :week="weekSelected"
        :suc="suc"
        :onClose="onCloseSupervisorModal"
        :fecha="fecha"
      >
      </modal-supervisor>
      <modal-gerente
        :isOpen="isGerenteModalOpen"
        :week="weekSelected"
        :suc="suc"
        :onClose="onCloseGerenteModal"
        :fecha="fecha"
      >
      </modal-gerente>
      <modal-gerente-cedis
        :isOpen="isGerenteCedisModalOpen"
        :week="weekSelected"
        :suc="suc"
        :onClose="onCloseGerenteCedisModal"
        :fecha="fecha"
      >
      </modal-gerente-cedis>
      <modal-agua
        :isOpen="isAguaModalOpen"
        :fecha="fechaSelected"
        :suc="suc"
        :turno="turnoSelected"
        :onClose="onModalAguaClose"
      ></modal-agua>
      <modal-luz
        :isOpen="isLuzModalOpen"
        :fecha="fechaSelected"
        :suc="suc"
        :turno="turnoSelected"
        :onClose="onModalLuzClose"
      ></modal-luz>
      <modal-maquinas
        :isOpen="isMaquinasModalOpen"
        :fecha="fechaSelected"
        :suc="suc"
        :turno="turnoSelected"
        :onClose="onMaquinasModalClose"
      ></modal-maquinas>
  </div>
</div>
</template>

<script>
import { getWeekDays } from '../../../assets/js/date-utilities';
import tablaCeldaVue from './tabla-celda.vue';
import ModalVendedor from './modal-vendedor.vue';
import ModalGasolina from './modal-gasolina.vue';
import modalSupervisor from './modal-supervisor.vue';
import ModalAgual from './modal-agua.vue';
import ModalLuz from './modal-luz.vue';
import ModalMaquinas from './modal-maquinas.vue';
import ModalGerente from './modal-gerente.vue';
import ModalGerenteCedisVue from './modal-gerenteCedis.vue';

export default {
  props: ['suc', 'fecha'],
  data: () => ({
    vendedorSelected: {},
    dataVendedorSelected: {},
    fechaSelected: null,
    turnoSelected: null,
    isGasolinaModalOpen: false,
    modalData: {
      kilosVendidos: {},
      productividad: '0%',
      capturaApp: '0%',
    },
    weekSelected: {},
    isMaquinasModalOpen: false,
    isVendedorModalOpen: false,
    isSupervisorModalOpen: false,
    isGerenteModalOpen: false,
    isGerenteCedisModalOpen: false,
    isAguaModalOpen: false,
    isLuzModalOpen: false,
    isLoaded: false,
    loadingVentas: true,
    loadingProduccion: true,
    loadingGerente: true,
    loadingAdmin: true,
    loadingSupervisor: true,
    supervisor: {},
    weekdays: [],
    ventas: [],
    ventasNames: [],
    produccion: [],
    gerente: [],
    modalsVendedor: {},
    administrativo: {},
    workedDays: {},
    acumulado: {},
    vendedores: [],
    topics: ['Vendidos', 'Productividad', 'Captura App', 'Km x litro'],
  }),
  async created() {
    this.weekDays = getWeekDays(this.fecha);
    const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=acumulado`, { fecha: this.fecha, suc: this.suc });
    this.acumulado = response.data;
    this.isLoaded = true;
    await Promise.allSettled([
      this.fetchVentas(),
      this.fetchProduccion(),
      this.fetchGerente(),
      this.fetchSupervisor(),
      this.fetchAdmin(),
    ]);
  },
  updated() {
    M.Collapsible.init(document.querySelectorAll('.collapsible'),);
  },
  methods:{
    async fetchVentas(){
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=ventas`, { fecha: this.fecha, suc: this.suc });
      this.ventas = response.data;
      this.ventasNames = this.getVentasNames();
      this.setWorkedDay();
      this.vendedores = this.getVendedoresObj();
      this.loadingVentas = false;
    },
    async fetchProduccion(){
      const rProduccion = await axios.post(`${env.REPORTES_CONCENTRADO}?option=produccion`, { fecha: this.fecha, suc: this.suc });
      this.produccion = rProduccion.data;
      this.produccionNames = this.getProduccionNames();
      this.loadingProduccion=false;
    },
    async fetchGerente(){
      const rGerente = await axios.post(`${env.REPORTES_CONCENTRADO}?option=gerente`, { fecha: this.fecha, suc: this.suc });
      this.gerente = rGerente.data;
      this.loadingGerente=false;
    },
    async fetchSupervisor(){
      const rSupervisor = await axios.post(`${env.REPORTES_CONCENTRADO}?option=supervisor`, { fecha: this.fecha, suc: this.suc });
      this.supervisor = rSupervisor.data;
      this.loadingSupervisor=false;
    },
    async fetchAdmin(){
      const rAdministrativo = await axios.post(`${env.REPORTES_CONCENTRADO}?option=administrativo`, { fecha: this.fecha, suc: this.suc });
      this.administrativo = rAdministrativo.data;
      this.loadingAdmin=false;
    },
    getVentasRow(fecha) {
      return this.ventas[fecha];
    },
    getProduccionRow(fecha) {
      return this.produccion[fecha];
    },
    getTurnos() {
      const [firstDate] = Object.values(this.produccion);
      if (firstDate) {
        return Object.keys(firstDate);
      }
      return [];
    },
    getProduccionNames() {
      const [firstDate] = Object.values(this.produccion);
      if (firstDate) {
        const [firstTurno] = Object.values(firstDate);
        if (firstTurno) {
          return Object.keys(firstTurno);
        }
      }
      return [];
    },
    setWorkedDay() {
      let vendedores = [];
      Object.values(this.ventas).forEach((v) => {
        vendedores = vendedores.concat(Object.keys(v));
      });
      const total = {};
      vendedores.forEach(v => {
        if (!total[v]) {
          total[v] = 1;
        } else {
          total[v]++;
        }
      });
      this.workedDays = total;
    },
    getVendedores() {
      let vendedores = [];
      Object.values(this.ventas).forEach((v) => {
        vendedores = vendedores.concat(Object.keys(v));
      });
      return [...new Set(vendedores)];
    },
    getVendedoresObj() {
      const vendedores = this.getVendedores();
      return vendedores.map((vendedor) => {
        // EMP0019[U00250] - EDGAR HERNANDEZ PENA
        const [claveCompuesta, nombre] = vendedor.split(' - ');
        const [clave, camioneta] = claveCompuesta.split('[');
        return {
          clave,
          nombre,
          camioneta: camioneta.slice(0,-1),
        }
      });
    },
    getVentasNames() {
      let fecha = null;
      Object.values(this.ventas).forEach((f) => {
        if(Object.values(f).length) {
          fecha = f;
        }
      });

      if (fecha) {
        const [firtVendedor] = Object.values(fecha);
        if (firtVendedor) {
          return Object.keys(firtVendedor);
        }
      }
      return []
    },
    getWeeks() {
      const [first] = Object.values(this.gerente);
      if (first) {
        return Object.keys(first);
      }
      return [];
    },
    parseVendedorToKey(vendedor) {
      // "EMP1716[U00219] - JOSUE JOAB FABIAN ABUNDIO"
      return `${vendedor.clave}[${vendedor.camioneta}] - ${vendedor.nombre}`;
    },
    getAcumuladoVenta(vendedor, name) {

      const val = Object.values(this.ventas).reduce((total, item) => {
        if (item[vendedor] && item[vendedor][name]) {
          total.real += item[vendedor][name].real;
          if (name == 'ventasApp' || name == 'productividad' | name == 'kmxlitro') {
            total.meta += item[vendedor][name].meta;
          } else {
            total.meta = item[vendedor][name].meta * 6;
          }
        }
        return { ...total };
      }, {
        real: 0,
        meta: 0,
      });
      if (name == 'kmxlitro') {
        val.real /= this.workedDays[vendedor];
        val.real = Math.ceil(val.real*10)/10;
        val.meta /= this.workedDays[vendedor];
        val.meta = Math.floor(val.meta);
      }
      if(name == "kilos") {
        return {
          ...val,
          aliasReal: "VENDIDOS",
        }
      }
      if(name == "productividad") {
        return {
          ...val,
          aliasReal: "VISITADOS",
          aliasMeta: "AGENDADOS",
        }
      }
      if(name == "ventasApp") {
        return {
          ...val,
          aliasReal: "APP",
          aliasMeta: "VENDIDOS",
        }
      }
      return val;
    },
    getAcumuladoProduccion(turno, name) {
      const val = Object.values(this.produccion).reduce((total, item) => {
        if (item[turno] && item[turno][name]) {
          total.real += item[turno][name].real;
          if(name == 'agua' || name == 'luz') {
            total.meta += item[turno][name].meta;
          } else {
            total.meta = item[turno][name].meta*7;
          }
        }
        return { ...total };
      }, {
        real: 0,
        meta: 0,
      });
      if(name == 'luz') {
        val.real /= 7;
        val.meta /= 7;
      }
      if(name == "kilos_barra" || name == "kilos_rolito") {
        return {
          ...val,
          aliasReal: "PRODUCIDO",
        }
      }
      // val.real /= 7;
      // val.meta /= 7;
      return val;
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
    goToArqueo(fecha, isGastos = '') {
      if (fecha) {
        let uri = `http://187.237.145.198/HLApp/GrupoFrio/views/reportes/arqueo.php?fecha=${fecha}&suc=${this.suc}`;
        if(isGastos) {
          uri = `http://187.237.145.198/HLApp/views/reportesVenta/?op=gastos&suc=${this.suc}&day1=${fecha}&day2=${fecha}#gastos`;
        }
        window.open(uri, '_blank');
      }
    },
    goToProduccion(turno) {
      const [id] = turno.split('-');
      const uri = `http://187.237.145.198/HLApp/GrupoFrio/views/comisiones/index.php?fecha=${this.fecha}&suc=${this.suc}&turno=${id}`;
      window.open(uri, '_blank');
    },
    getAcumuladoVentaSelected() {
      const data = {};
      const vendedor = this.parseVendedorToKey(this.vendedorSelected);
      for(let name of this.ventasNames) {
        data[name] = this.getAcumuladoVenta(vendedor, name);
      }
      return { ...data };
    },
    openModal(vendedor) {
      const [claveCompuesta, nombre] = vendedor.split(' - ');
      const [clave] = claveCompuesta.split('[');
      this.vendedorSelected = this.vendedores.find((v) => v.clave == clave);
      if (this.vendedorSelected) {
        this.dataVendedorSelected = this.getAcumuladoVentaSelected();
        this.modalData.kilosVendidos = this.getKilosVendido(this.vendedorSelected);
        this.modalData.productividad = this.getPorcentaje(this.vendedorSelected, 'productividad');
        this.modalData.capturaApp = this.getPorcentaje(this.vendedorSelected, 'ventasApp');
        this.isVendedorModalOpen = true;
      }
    },
    openSupervisorModal(index) {
      const newWeekSelected = {};
      Object.entries(this.supervisor).forEach(([name, val])=>{
        newWeekSelected[name] = Object.values(val)[index];
      });
      this.weekSelected = {...newWeekSelected, index};
      this.isSupervisorModalOpen = true;
    },
    openGerenteModal(index) {
      const newWeekSelected = {};
      Object.entries(this.gerente).forEach(([name, val])=>{
        newWeekSelected[name] = Object.values(val)[index];
      });
      this.weekSelected = {...newWeekSelected, index};
      this.isGerenteModalOpen = true;
    },
    openGerenteCedisModal(index) {
      const newWeekSelected = {};
      Object.entries(this.gerente).forEach(([name, val])=>{
        newWeekSelected[name] = Object.values(val)[index];
      });
      this.weekSelected = {...newWeekSelected, index};
      this.isGerenteCedisModalOpen = true;
    },
    onVendedorRealClick(cellName, fecha, vendedor) {
      this.vendedorSelected = this.vendedores.find((v) => v.clave == vendedor);
      this.fechaSelected = fecha;
      this.isGasolinaModalOpen = true;
    },
    onAguaClick(indexCell, fecha,_,turno) {
      this.turnoSelected = turno;
        this.fechaSelected = fecha;
      if(indexCell == 2) {
        this.isAguaModalOpen = true;
      } else if(indexCell == 3) {
        this.isLuzModalOpen = true;
      } else {
        this.isMaquinasModalOpen = true;
      }
    },
    onCloseModal() {
      this.isVendedorModalOpen = false;
    },
    onCloseGasolinaModal() {
      this.isGasolinaModalOpen = false;
    },
    onCloseSupervisorModal() {
      this.isSupervisorModalOpen = false;
    },
    onCloseGerenteModal() {
      this.isGerenteModalOpen = false;
    },
    onCloseGerenteCedisModal() {
      this.isGerenteCedisModalOpen = false;
      console.log('gerente cedis');
    },
    onModalAguaClose() {
      this.isAguaModalOpen = false;
    },
    onModalLuzClose() {
      this.isLuzModalOpen = false;
    },
    onMaquinasModalClose() {
      this.isMaquinasModalOpen = false;
    },
    getKilosVendido(vendedor) {
      const formatedName = `${vendedor.clave}[${vendedor.camioneta}] - ${vendedor.nombre}`;
      const kilos = this.getAcumuladoVenta(formatedName, 'kilos')
      return kilos;
    },
    getPorcentaje(vendedor, tipo) {
      const formatedName = `${vendedor.clave}[${vendedor.camioneta}] - ${vendedor.nombre}`;
      const dato = this.getAcumuladoVenta(formatedName, tipo);
      const porcentaje = dato.meta > 0 ? Math.floor((dato.real/dato.meta)*100) : 0
      return `${porcentaje} %`;
    },
  },
  components: {
    'tabla-celda': tablaCeldaVue,
    'modal-vendedor': ModalVendedor,
    'modal-gerente': ModalGerente,
    'modal-gerente-cedis': ModalGerenteCedisVue,
    'modal-gasolina': ModalGasolina,
    'modal-supervisor': modalSupervisor,
    'modal-agua': ModalAgual,
    'modal-luz': ModalLuz,
    'modal-maquinas': ModalMaquinas,
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