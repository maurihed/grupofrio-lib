<template>
  <div class="center">
    <br>
    <div v-if="!isLoaded">
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoaded">
      <ul class="collapsible popout">
        <li>
          <div class="collapsible-header"><i class="material-icons">radio_button_checked</i>Produccion</div>
            <div class="collapsible-body">
              <table class="bordered">
                <thead>
                  <tr>
                      <td class="center bold">PRODUCTO</td>
                      <td class="center bold">{{'Sabado ('+sabado+')'}}</td>
                      <td class="center bold">{{'Domingo ('+domingo+')'}}</td>
                      <td class="center bold">{{'Lunes ('+lunes+')'}}</td>
                      <td class="center bold">{{'Martes ('+martes+')'}}</td>
                      <td class="center bold">{{'Miercoles ('+miercoles+')'}}</td>
                      <td class="center bold">{{'Jueves ('+jueves+')'}}</td>
                      <td class="center bold">{{'Viernes ('+viernes+')'}}</td>
                      <td class="center bold">TOTAL</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="name in productos" :key="name">
                    <td><span :class="'new badge '+getColor(data[name][0].id)" :data-badge-caption="getType(data[name][0].id)"></span> {{name}}</td>
                    <td class="center">{{getPeso(sabado, data[name]) | number}}</td>
                    <td class="center">{{getPeso(domingo, data[name]) | number}}</td>
                    <td class="center">{{getPeso(lunes, data[name]) | number}}</td>
                    <td class="center">{{getPeso(martes, data[name]) | number}}</td>
                    <td class="center">{{getPeso(miercoles, data[name]) | number}}</td>
                    <td class="center">{{getPeso(jueves, data[name]) | number}}</td>
                    <td class="center">{{getPeso(viernes, data[name]) | number}}</td>
                    <td class="center">{{getRowTotal(data[name]) | number}}</td>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <td colspan="9" class="center bold">CONSENTRADO</td>
                  </tr>
                </thead>
                <tbody>
                  <tr class="center">
                    <td class="left-align">Kilos rolito</td>
                    <td v-for="d in days" :key="d">
                      {{getTotalKilos('rolito', d) | number}}
                    </td>
                    <td>{{totalKilosRolitos | number}}</td>
                  </tr>
                  <tr class="center">
                    <td class="left-align">Eficiencia</td>
                    <td v-for="d in days" :key="d">
                      <porcentaje-eficiencia
                        :variable="getCombinada(3)"
                        :total="getTotalKilos('rolito', d)"
                      >
                      </porcentaje-eficiencia>
                    </td>
                    <td>
                      <porcentaje-eficiencia
                        :variable="getCombinada(3)"
                        :total="totalKilosRolitos / 7"
                      >
                      </porcentaje-eficiencia>
                    </td>
                  </tr>
                  <tr> <td colspan="9" class="bb-0 bg-gray"></td> </tr>
                  <tr class="center">
                    <td class="left-align">Kilos barra</td>
                    <td v-for="d in days" :key="d">
                      {{getTotalKilos('barra', d) | number}}
                    </td>
                    <td>{{totalKilosBarras | number}}</td>
                  </tr>
                  <tr class="center">
                    <td class="left-align">Eficiencia</td>
                    <td v-for="d in days" :key="d">
                      <porcentaje-eficiencia
                        :variable="getCombinada(1)"
                        :total="getTotalKilos('barra', d)"
                      >
                      </porcentaje-eficiencia>
                    </td>
                    <td>
                      <porcentaje-eficiencia
                        :variable="getCombinada(1)"
                        :total="totalKilosBarras / 7"
                      >
                      </porcentaje-eficiencia>
                    </td>
                  </tr>
                  <tr> <td colspan="9" class="bb-0 bg-gray"></td> </tr>
                  <tr class="center">
                    <td class="left-align">Litros agua</td>
                    <td v-for="d in days" :key="d">
                      {{getTotalKilos('agua', d) | number}}
                    </td>
                    <td>{{totalLitrosAgua | number}}</td>
                  </tr>
                  <tr class="center">
                    <td class="left-align">Eficiencia</td>
                    <td v-for="d in days" :key="d">
                      <porcentaje-eficiencia
                        :variable="{valor: valorVariable('Agua Litros Minimos')}"
                        :total="getTotalKilos('agua', d)"
                      >
                      </porcentaje-eficiencia>
                    </td>
                    <td>
                      <porcentaje-eficiencia
                        :variable="{valor: valorVariable('Agua Litros Minimos')}"
                        :total="totalLitrosAgua / 7"
                      >
                      </porcentaje-eficiencia>
                    </td>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <td colspan="9" class="center bold">FALLAS</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Numero de fallas</td>
                    <td class="center" v-for="day in days" :key="day">{{getDataProduccion(day, 'fallas')}}</td>
                    <td class="center">{{totalDataProduccion('fallas')}}</td>
                  </tr>
                  <tr>
                    <td>Numero de Soluciones</td>
                    <td class="center" v-for="day in days" :key="day">{{getDataProduccion(day, 'soluciones')}}</td>
                    <td class="center">{{totalDataProduccion('soluciones')}}</td>
                  </tr>
                  <tr>
                    <td>Eficiencia</td>
                    <td class="center" v-for="day in days" :key="day" v-html="porcentajeToString(getDataProduccion(day, 'eficiencia'))"></td>
                    <td class="center" v-html="porcentajeToString(totalDataProduccion('eficiencia'))"></td>
                  </tr>
                </tbody>
              </table>
          </div>
        </li>
      </ul>
      <ul class="collapsible popout">
        <li>
          <div class="collapsible-header"><i class="material-icons">radio_button_checked</i>Eficiencias</div>
            <div class="collapsible-body">
              <table class="bordered">
                <thead>
                  <tr>
                      <td class="center bold">Producto</td>
                      <td class="center bold">{{'Sabado ('+sabado+')'}}</td>
                      <td class="center bold">{{'Domingo ('+domingo+')'}}</td>
                      <td class="center bold">{{'Lunes ('+lunes+')'}}</td>
                      <td class="center bold">{{'Martes ('+martes+')'}}</td>
                      <td class="center bold">{{'Miercoles ('+miercoles+')'}}</td>
                      <td class="center bold">{{'Jueves ('+jueves+')'}}</td>
                      <td class="center bold">{{'Viernes ('+viernes+')'}}</td>
                      <td class="center bold disabled">TOTAL</td>
                  </tr>
                </thead>
                <thead>               
                  <tr>
                    <td colspan="9" class="center bold">Agua</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Consumo litros</td>
                    <td class="center" v-for="day in days" :key="day">{{getConsumo(day) | number}}</td>
                    <td class="center disabled">{{getConsumoTotal() | number}}</td>
                  </tr>
                  <tr>
                    <td>Consumo Maximo producción</td>
                    <td class="center" v-for="day in days" :key="day">{{valorVariable('merma agua') * (Number(getTotalKilos('rolito', day)) + Number(getTotalKilos('barra', day))) | number}}</td>
                    <td class="center disabled">{{ valorVariable('merma agua') *  (Number(totalKilosRolitos) + Number(totalKilosBarras)) | number}}</td>
                  </tr>
                  <tr>
                    <td>Consumo Agua venta</td>
                    <td class="center" v-for="day in days" :key="day">{{getTotalKilos('agua', day) | number}}</td>
                    <td class="center disabled">{{totalLitrosAgua | number}}</td>
                  </tr>
                  <tr>
                    <td>Consumo Hielo</td>
                    <td class="center" v-for="day in days" :key="day">{{getConsumo(day) - Number(getTotalKilos('agua', day)) | number}}</td>
                    <td class="center disabled">{{getConsumoTotal() - totalLitrosAgua | number}}</td>
                  </tr>
                  <tr>
                    <td>Eficiencia</td>
                    <td class="center" v-for="day in days" :key="day" v-html="getEficienciaAgua(day)"></td>
                    <td class="center" v-html="getEficienciaTotalAgua()"></td>
                  </tr>
                  <tr> <td colspan="9" class="bb-0 bg-gray"></td> </tr>
                </tbody>
                <thead>               
                  <tr>
                    <td colspan="9" class="center bold">Energia</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Consumo</td>
                    <td class="center" v-for="day in days" :key="day">{{valorVariable('Multiplicador Kwh') * getConsumo(day,'Electricidad') | number}}</td>
                    <td class="center disabled">{{valorVariable('Multiplicador Kwh') * getConsumoTotal('Electricidad') | number}}</td>
                  </tr>
                  <tr>
                    <td>Kilos producción</td>
                    <td class="center" v-for="day in days" :key="day">{{Number(getTotalKilos('rolito', day)) + Number(getTotalKilos('barra', day)) | number}}</td>
                    <td class="center disabled">{{Number(totalKilosRolitos) + Number(totalKilosBarras) | number}}</td>
                  </tr>
                  <tr>
                    <td>kg/Kwh</td>
                    <td class="center" v-for="day in days" :key="day">{{getKgKwh(day) | number}}</td>
                    <td class="center disabled">{{getTotalKgKwh() | number}}</td>
                  </tr>
                  <tr>
                    <td>Eficiencia</td>
                    <td class="center" v-for="day in days" :key="day" v-html="getEficienciaKgKwh(day)"></td>
                    <td class="center" v-html="getEficienciaTotalElectricidad()"></td>
                  </tr>
                  <tr> <td colspan="9" class="bb-0 bg-gray"></td> </tr>
                </tbody>
                <thead>               
                  <tr>
                    <td colspan="9" class="center bold">Aceite</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(compresorName, key) in compresoresNames" :key="key">
                    <td>{{compresorName}}</td>
                    <td class="center" v-for="day in days" :key="day">{{getConsumoCompresor(compresorName, day)| number}}</td>
                    <td class="center disabled">{{getConsumoTotalCompresor(compresorName)}}</td>
                  </tr>
                  <tr>
                    <td>Horas trabajadas</td>
                    <td class="center" v-for="day in days" :key="day">{{valorVariable('Horas trabajadas')}}</td>
                    <td class="center disabled">{{valorVariable('Horas trabajadas')*7 | number}}</td>
                  </tr>
                  <tr>
                    <td>Consumo maximo L</td>
                    <td class="center" v-for="day in days" :key="day">{{valorVariable('Consumo maximo aceite') * compresoresNames.length}}</td>
                    <td class="center disabled">{{valorVariable('Consumo maximo aceite') * compresoresNames.length * 7 | number}}</td>
                  </tr>
                  <tr>
                    <td>Eficiencia</td>
                    <td class="center" v-for="day in days" :key="day" v-html="getEficienciaAceite(day)"></td>
                    <td class="center" v-html="getEficienciaTotalAceite()"></td>
                  </tr>
                  <tr> <td colspan="9" class="bb-0 bg-gray"></td> </tr>
                </tbody>
              </table>
              <eficiencia-generica v-for="(tipo, name) in eficienciaByTipos" :key="name"
                :tipo="name"
                :variables="tipo"
                :days="days"
                :esperado="getValorEsperado(name)"
                :fecha="fecha"
              >
              </eficiencia-generica>
          </div>
        </li>
      </ul>
      <ul class="collapsible popout">
        <li>
          <div class="collapsible-header"><i class="material-icons">radio_button_checked</i>Limpieza</div>
            <div class="collapsible-body">
              <table class="bordered">
                <thead>
                  <tr>
                      <td class="center bold"></td>
                      <td class="center bold">{{'Sabado ('+sabado+')'}}</td>
                      <td class="center bold">{{'Domingo ('+domingo+')'}}</td>
                      <td class="center bold">{{'Lunes ('+lunes+')'}}</td>
                      <td class="center bold">{{'Martes ('+martes+')'}}</td>
                      <td class="center bold">{{'Miercoles ('+miercoles+')'}}</td>
                      <td class="center bold">{{'Jueves ('+jueves+')'}}</td>
                      <td class="center bold">{{'Viernes ('+viernes+')'}}</td>
                      <td class="center bold">TOTAL</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-justify">Incidencias</td>
                    <td v-for="day in days" :key="day">{{getIncidenciasLimpieza(day, 'problemas')}}</td>
                    <td>{{getTotalIncidencias('problemas')}}</td>
                  </tr>
                  <tr>
                    <td class="text-justify">Solucionadas</td>
                    <td v-for="day in days" :key="day">{{getIncidenciasLimpieza(day, 'soluciones')}}</td>
                    <td>{{getTotalIncidencias('soluciones')}}</td>
                  </tr>
                  <tr>
                    <td class="text-justify">Eficiencia</td>
                    <td v-for="day in days" :key="day" v-html="getEficienciaDeIncidencias(day)"></td>
                    <td><span v-html="getEficienciaTotalDeIncidencias()"></span></td>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <td colspan="9" class="center bold">Fallas mecanicas</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-justify">Incidencias</td>
                    <td v-for="day in days" :key="day">{{getProblemasMecanicos(day, 'problemas')}}</td>
                    <td>{{getTotalProblemasMecanicos('problemas')}}</td>
                  </tr>
                  <tr>
                    <td class="text-justify">Solucionadas</td>
                    <td v-for="day in days" :key="day">{{getProblemasMecanicos(day, 'soluciones')}}</td>
                    <td>{{getTotalProblemasMecanicos('soluciones')}}</td>
                  </tr>
                  <tr>
                    <td class="text-justify">Eficiencia</td>
                    <td v-for="day in days" :key="day" v-html="getEficienciaDeProblemasMecanicos(day)"></td>
                    <td><span v-html="getEficienciaTotalDeProblemasMecanicos()"></span></td>
                  </tr>
                </tbody>
              </table>
            </div>
        </li>
      </ul>
      <br>
      <salario-comision
        :totalKilosBarras="totalKilosBarras"
        :totalKilosRolitos="totalKilosRolitos"
        :precioCubero="valorVariable('Precio kilo cubero')"
        :precioSacador="valorVariable('Precio kilo sacador')"
        :precioMaquinista="valorVariable('Precio kilo especialiasta')"
        :precioLider="valorVariable('Precio kilo lider')"
        :eficiencia="getTotalEficiencia()"
        :sueldoCubero="valorVariable('Sueldo base cubero')"
        :sueldoSacador="valorVariable('Sueldo base sacador')"
        :sueldoMaquinista="valorVariable('Sueldo base especialista')"
        :sueldoLider="valorVariable('Sueldo base lider')"
        :sacadores="empleados.sacadores"
        :cuberos="empleados.cuberos"
        :maquinistas="empleados.maquinistas"
        :jefes-produccion="empleados.jefes_produccion"
      ></salario-comision>
    </div>
  </div>
</template>
<script>
import porcentajeEficiencia from './porcentajeEficiencia.vue';
import rowRendimientoMerma from './rowRendimientoMerma.vue';
import eficienciaGenerica from './eficienciaGenerica.vue';
import salarioComision from './salario-comision.vue';
import { getDate } from '../../assets/js/utilities';
export default {
  data() {
    return {
      isLoaded: false,
      productos: [],
      data: {},
      totalKilosBarras: 0,
      totalKilosRolitos: 0,
      totalLitrosAgua: 0,
      variables: [],
      variablesCombinadas: [],
      fallas_produccion: [],
      variablesMerma: [],
      tiposMerma: [],
      rendimientoMerma: [],
      eficienciaCompresores: {},
      compresoresNames: 0,
      eficienciaByTipos: [],
      empleados: {
        cuberos: [],
        sacadores: [],
        maquinistas: [],
        jefes_produccion: [],
      },
      inicidenciasLimpieza: {
        problemas: [],
        soluciones: [],
      },
      problemasMecanicos: {
        problemas: [],
        soluciones: [],
      },
      tiposRollito: [
        'LARO0001',
        'LARO0002',
        'LARO0003',
        'LARO0004',
        'LARO0005',
        'LARO0006',
        'LARO0007',
        'LARO0008',
        'LARO0009',
        'CRRO0001',
        'CRRO0002',
        'CRRO0003',
        'KOCI0001',
        'KOCU0001',
        'KOCI0002',
        'KOCI0003',
      ],
      tiposBarra: [
        'BARR0001',
        'BARR0002',
        'BARR0003',
        'BARR0004',
        'BARR0005',
        'BARR0006',
        'BARR0007',
        'BARR0008',
        'CRRO0002',
        'CRRO0003',
        'LABA0001',
        'LARO0010',
        'LAMQ0001',
        'LAMQ0002',
        'BAMO0001',
        'BAMO0002',
        'BAMO0003',
        'BAMO0004',
        'BAMO0005',
      ],
      tiposAgua: [
        'AGUA0001',
        'AGUA0002',
        'AGUA0003',
        'AGUA0004',
        'AGUA0005',
        'AGUA0006',
        'AGUA0007',
        'AGUA0008',
        'CRAG0001',
        'CRAG0002',
        'CRAG0003',
        'CRAG0004',
      ],
    }
  },
  props: ['fecha', 'suc', 'turno'],
  async created() {
    await this.fetchVariablesComisiones();
    await this.fetchProduccion();
    await this.fetchFallasProduccion();
    await this.fetchBitacoraMerma();
    await this.fetchTiposMerma();
    await this.fetchIncidenciasLimpieza();
    await this.fetchProblemasMaquinaria();
    await this.fetchCompresores();
    await this.fetchEficienciaGenerica();
    await this.fetchVariablesCombinadas();
    await this.fetchEmpleados();
    this.isLoaded = true;
  },
  updated() {
    M.Collapsible.init(document.querySelectorAll('.collapsible'));
  },
  filters: {
    number(value) {
      if (!value) return 0;
      return new Intl.NumberFormat("es-MX").format(value);
    },
    porcentaje(value) {
      if (!value) return `<span class="red-text">${value} %</span>`;
      return `<span class="${ value < 50 ? 'red-text' : 'green-text'}">${value} %</span>`;
    }
  },
  methods: {
    plusDay(currentDay, day) {
      const newDate = this.fecha.slice(0,-2) + (currentDay + "").padStart(2, 0);
      const date = new Date(newDate);
      return new Date(date.setDate(date.getDate() + 1 + day)).getDate();
    },
    getPeso(day, fechas) {
      const producto = fechas.find(f => new Date(f.DocDate).getDate() == day);
      return producto ? Number(producto.TOTAL) : 0;
    },
    getRowTotal(row) {
      return row.reduce((total,item) => total + Number(item.TOTAL), 0);
    },
    getTotal(fechas) {
      return Object.values(fechas).reduce(
        (total, p) => total + p.reduce(
          (t, i) => t+Number(i.TOTAL), 0), 0
        );
    },
    getType(code) {
      if (this.tiposBarra.includes(code)) return 'Barra';
      if (this.tiposRollito.includes(code)) return 'Rollito';
      if (this.tiposAgua.includes(code)) return 'Agua';
      return 'Sin tipo';
    },
    getColor(code) {
      if (this.tiposBarra.includes(code)) return 'blue';
      if (this.tiposRollito.includes(code)) return 'yellow darken-4';
      if (this.tiposAgua.includes(code)) return 'cyan';
      return 'gray';
    },
    getTotalKilos(tipo, day) {
      let total = 0;
      let filteredArray = [];
      switch(tipo) {
        case 'barra': filteredArray = this.tiposBarra; break;
        case 'rolito': filteredArray = this.tiposRollito; break;
        case 'agua': filteredArray = this.tiposAgua; break;
      }
      Object.values(this.data).forEach(p => {
        const c = p.filter(f => new Date(f.DocDate).getDate() == day)
        if (!!c.length) {
          if(filteredArray.includes(c[0].id)) {
            total += c[0].Peso * c[0].TOTAL;
          }
        }
      });
      return total.toFixed(4);
    },
    sumTotalKilos(tipo) {
      let filteredArray = [];
      switch(tipo) {
        case 'barra': filteredArray = this.tiposBarra; break;
        case 'rolito': filteredArray = this.tiposRollito; break;
        case 'agua': filteredArray = this.tiposAgua; break;
      }
      let total = 0;
      Object.values(this.data).forEach(p => {
        p.forEach( c => {
          if (filteredArray.includes(c.id)) {
            total += c.Peso * c.TOTAL;
          }
        });
      });
      return total.toFixed(4);
    },
    getVariable(id) {
      return this.variables.find(v => v.id == id);
    },
    porcentajeToString(porcentaje) {
      return porcentaje < 50 ? `<span class="red-text">${porcentaje.toFixed(2)} %</span>`:`<span class="green-text">${porcentaje.toFixed(2)} %</span>`;
    },
    getDataProduccion(day, tipo) {
      const fecha = getDate(this.fecha, this.days, String(day));
      if (!this.fallas_produccion[`F${fecha}`]) {
        return 0;
      }
      const value = this.fallas_produccion[`F${fecha}`][tipo];
      return !!value ? value : 0;
    },
    totalDataProduccion(tipo) {
      if (!Object.keys(this.fallas_produccion).length) {
        return 0;
      }
      const porcentaje = Object.values(this.fallas_produccion).reduce((total, item) => total += Number(item[tipo]), 0)
      return tipo === 'eficiencia' ? porcentaje / 7 : porcentaje;
    },
    getIncidenciasLimpieza(day, tipo) {
      const fecha = getDate(this.fecha, this.days, String(day));
      const incidencias = this.inicidenciasLimpieza[tipo];
      const item = incidencias.find(i => i.fecha == fecha);
      return item ? item.cantidad : 0;
    },
    getTotalIncidencias(tipo) {
      const incidencias = this.inicidenciasLimpieza[tipo];
      return incidencias.reduce((t, item) => t + Number(item.cantidad), 0)
    },
    getEficienciaDeIncidencias(day, asNumber = false) {
      const problemas = this.getIncidenciasLimpieza(day, 'problemas');
      const soluciones = this.getIncidenciasLimpieza(day, 'soluciones');
      if(problemas == 0 && asNumber) {
        return 100;
      }
      if (problemas == 0) return `<span class="green-text">100 %</span>`;
      const value = ((soluciones / problemas )* 100).toFixed(1);
      if (asNumber) {
        return Number(value);
      }
      return `<span class="${ value < 50 ? 'red-text' : 'green-text'}">${value} %</span>`
    },
    getEficienciaTotalDeIncidencias(asNumber = false) {
      const total = this.days.reduce((total, day) => total + this.getEficienciaDeIncidencias(day, true), 0);
      const porcentaje = total / 7;
      if (asNumber) {
        return Number(porcentaje);
      }
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje.toFixed(2)} %</span>`;
    },
    getProblemasMecanicos(day, tipo) {
      const fecha = getDate(this.fecha, this.days, String(day));
      const incidencias = this.problemasMecanicos[tipo];
      const item = incidencias.find(i => i.fecha == fecha);
      return item ? item.cantidad : 0;
    },
    getTotalProblemasMecanicos(tipo) {
      const incidencias = this.problemasMecanicos[tipo];
      return incidencias.reduce((t, item) => t + Number(item.cantidad), 0)
    },
    getEficienciaDeProblemasMecanicos(day, asNumber = false) {
      const problemas = this.getProblemasMecanicos(day, 'problemas');
      const soluciones = this.getProblemasMecanicos(day, 'soluciones');
      if(problemas == 0 && asNumber) {
        return 100;
      }
      if (problemas == 0) return `<span class="green-text">100 %</span>`;
      const value = ((soluciones / problemas )* 100).toFixed(1);
      if (asNumber) {
        return Number(value);
      }
      return `<span class="${ value < 50 ? 'red-text' : 'green-text'}">${value} %</span>`
    },
    getEficienciaTotalDeProblemasMecanicos(asNumber = false) {
      const total = this.days.reduce((total, day) => total + this.getEficienciaDeProblemasMecanicos(day, true), 0);
      const porcentaje = total / 7;
      if (asNumber) {
        return porcentaje;
      }
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${(porcentaje).toFixed(2)} %</span>`;
    },
    getEficienciaAgua(day, asNumber = false) {
      const consumoMaximoHielo = this.valorVariable('merma agua') * (Number(this.getTotalKilos('rolito', day)) + Number(this.getTotalKilos('barra', day)));
      const consumoHielo = this.getConsumo(day) - Number(this.getTotalKilos('agua', day));
      const porcentaje = consumoHielo == 0 ? 0 : ((consumoMaximoHielo / consumoHielo) * 100).toFixed(2);
      if (asNumber) {
        return Number(porcentaje);
      }
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje} %</span>`;
    },
    getEficienciaTotalAgua(asNumber = false) {
      const porcentaje = this.days.reduce((total, day) => total + this.getEficienciaAgua(day, true), 0) / this.days.length;
      if (asNumber) {
        return porcentaje;
      }
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje.toFixed(2)} %</span>`;
    },
    getConsumo(day, tipo = "Agua") {
      const date = getDate(this.fecha, this.days, String(day));
      if(this.rendimientoMerma.length === 0) {
        return 0;
      }
      const variables = this.rendimientoMerma && this.rendimientoMerma[`F${date}`] ? this.rendimientoMerma[`F${date}`].tipos[tipo] : [];
      return variables.reduce((total, item) => {
        const value = item.valor_final ? item.valor_final - item.valor_inicial : item.valor_inicial;
        return total+Number(value)
        }, 0);
    },
    getConsumoTotal(tipo= "Agua") {
      return Object.values(this.rendimientoMerma).reduce((total, fecha) => total + fecha.tipos[tipo].reduce((sub, item)=> {
        const value = item.valor_final ? item.valor_final - item.valor_inicial : item.valor_inicial;
        return sub+Number(value)
        }, 0),0);
    },
    valorVariable(name) {
      const valor = this.variables.find(v=>v.descripcion == name);
      if (!valor) return 0;
      return Number(valor.valor);
    },
    getKgKwh(day) {
      const consumo = this.valorVariable('Multiplicador Kwh') * this.getConsumo(day,'Electricidad');
      const produccion = Number(this.getTotalKilos('rolito', day)) + Number(this.getTotalKilos('barra', day))
      const total = consumo > 0 ? (produccion / consumo).toFixed(2) : 0;
      return Number(Number(total).toFixed(2));
    },
    getTotalKgKwh() {
      return this.days.reduce((total, day) => total + this.getKgKwh(day), 0);
    },
    getEficienciaKgKwh(day, asNumber = false) {
      const porcentaje = this.valorVariable('Kwh/kg esperado') ? this.getKgKwh(day) / this.valorVariable('Kwh/kg esperado') * 100 : 0;
      if (asNumber) {
        return Number(porcentaje);
      }
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje.toFixed(2)} %</span>`;
    },
    getEficienciaTotalElectricidad(asNumber = false) {
      const porcentaje = this.days.reduce((total, day)=> total + this.getEficienciaKgKwh(day, true), 0);
      if (asNumber) {
        return porcentaje;
      }
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje.toFixed(2)} %</span>`;
    },
    getConsumoCompresor(compresorName, day) {
      const date = getDate(this.fecha, this.days, String(day));
      const fechaData = this.eficienciaCompresores[`F${date}`];
      if (!fechaData) {
        return 0;
      }
      return fechaData[compresorName] ? Number(fechaData[compresorName]) : 0;
    },
    getConsumoTotalCompresor(compresorName) {
      const total = this.days.reduce((total, day) => total + this.getConsumoCompresor(compresorName, day), 0);
      const porcentaje =  total;
      return porcentaje;
    },
    getEficienciaAceite(day, asNumber = false) {
      const fecha = getDate(this.fecha, this.days, day+'');
      let porcentaje = 0;
      if (this.eficienciaCompresores[`F${fecha}`]) {
        const consumo = this.eficienciaCompresores[`F${fecha}`].total;
        const maximo = this.valorVariable('Consumo maximo aceite') * this.compresoresNames.length;
        porcentaje = consumo ? (maximo / consumo) * 100 : 0;
      }
      if (asNumber) {
        return Number(porcentaje);
      }
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje.toFixed(2)} %</span>`;
    },
    getEficienciaTotalAceite(asNumber = false) {
      const divisor = 7; 
      const porcentaje =  this.days.reduce((total, day) => total + this.getEficienciaAceite(day, true), 0) / divisor;
      if (asNumber) {
        return porcentaje;
      }
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje.toFixed(2)} %</span>`;
    },
    getValorEsperado(tipo) {
      switch(tipo) {
        case 'Bolsa': return this.valorVariable('Bolsas minimas a utilizar') || 1;
        case 'Grapa - Inventario': return this.valorVariable('Grapas minimas a utilizar') || 1;
        case 'Grapa - Carrete': return this.valorVariable('Carrete minimo a utilizar') || 1;
        case 'Sal': return this.valorVariable('Grados Baume promedio') || 1;
        case 'Amoniaco': return this.valorVariable('Lectura recibidor esperada') || 1;
      }
      return 1;
    },
    getCombinada(TMId) {
      const variable = {...this.variablesCombinadas.find((v) => v.TMId == TMId)};
      return variable;
    },
    getEficienciaTotalMermaGenerica() {
      const eficiencias = [];
      for(let typeName in this.eficienciaByTipos) {
        const tipoObj = this.eficienciaByTipos[typeName];
        const [tipo] = Object.values(tipoObj);
        const { total } = tipo;
        const esperado = this.getValorEsperado(typeName);
        const eficiencia = total / 7 / esperado * 100;
        eficiencias.push(eficiencia);
      }
      return eficiencias;
    },
    getEficienciaTotalProduccion(tipo) {
      let variable = {};
      let total = 0;
      switch(tipo) {
        case 'Rollito':
          const t = this.getCombinada(3);
          variable = t ? t.valor : 0;
          total = this.totalKilosRolitos / 7;
          break;
        case 'Barra':
          const t2 = this.getCombinada(1);
          variable = t2 ? t2.valor : 0;
          total = this.totalKilosBarras / 7;
          break;
        case 'Agua':
          variable = this.valorVariable('Agua Litros Minimos');
          total = this.totalLitrosAgua / 7;
          break;
      }
      if (!variable) return 0;
      if (!Number(variable)) return 0;
      return Number((total / variable * 100).toFixed(2));
    },
    getTotalEficiencia() {
      const eficienciaProduccionRollito = this.getEficienciaTotalProduccion('Rollito');
      const eficienciaProduccionBarra = this.getEficienciaTotalProduccion('Barra');
      const eficienciaProduccionAgua = this.getEficienciaTotalProduccion('Agua');
      const eficienciaFallasProduccion = this.totalDataProduccion('eficiencia');
      const eficienciaAgua = this.getEficienciaTotalAgua(true);
      const eficienciaEnergia = this.getEficienciaTotalElectricidad(true);
      const eficienciaAceite = this.getEficienciaTotalAceite(true);
      const eficienciaMermaGenerica = this.getEficienciaTotalMermaGenerica();
      const eficienciaLimpieza = this.getEficienciaTotalDeIncidencias(true);
      const eficienciaMecanica = this.getEficienciaTotalDeProblemasMecanicos(true);
      
      const eficiencias = [
        eficienciaProduccionRollito
        ,eficienciaProduccionBarra
        ,eficienciaProduccionAgua
        ,eficienciaFallasProduccion
        ,eficienciaAgua
        ,eficienciaEnergia
        ,eficienciaAceite
        ,...eficienciaMermaGenerica
        ,eficienciaLimpieza
        ,eficienciaMecanica
      ];
      return (eficiencias.reduce((a, b) => a + b, 0) / eficiencias.length).toFixed(2);
    },
    async fetchVariablesComisiones() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getVariables`, { suc: this.suc });
      this.variables = response.data;
      this.variables.forEach(v => v.valor = Number(Number(v.valor).toFixed(3)));
    },
    async fetchProduccion() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getProduccion`,{ fecha: this.fecha, suc: this.suc, turno: this.turno });
      this.data = response.data;
      this.totalKilosBarras = this.sumTotalKilos('barra');
      this.totalKilosRolitos = this.sumTotalKilos('rolito');
      this.totalLitrosAgua = this.sumTotalKilos('agua');
      this.productos = Object.keys(this.data);
    },
    async fetchFallasProduccion() {
      const fallas_produccion = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getErroresProduccion`, { fecha: this.fecha, suc: this.suc, turno: this.turno });
      this.fallas_produccion = fallas_produccion.data;
    },
    async fetchBitacoraMerma() {
      const bMerma = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getBitacoraMerma`,{ fecha: this.fecha, suc: this.suc, turno: this.turno });
      this.rendimientoMerma = bMerma.data;
    },
    async fetchTiposMerma() {
      const tiposMerma = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getTiposMerma`, {suc: this.suc});
      this.tiposMerma = tiposMerma.data;
    },
    async fetchIncidenciasLimpieza() {
      const inicidenciasLimpieza = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getIncidenciasLimpieza`, {fecha: this.fecha, suc: this.suc, turno: this.turno});
      this.inicidenciasLimpieza = inicidenciasLimpieza.data;
    },
    async fetchProblemasMaquinaria() {
      const problemasMecanicos = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getProblemasMaquinaria`, {fecha: this.fecha, suc: this.suc, turno: this.turno});
      this.problemasMecanicos = problemasMecanicos.data;
    },
    async fetchCompresores() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getRendimientoAceite`, {fecha: this.fecha, suc: this.suc, turno: this.turno});
      this.eficienciaCompresores = response.data;
      if(Object.keys(this.eficienciaCompresores).length) {
        const [MaxCompresores] = Object.values(this.eficienciaCompresores).sort((itemA, itemB) => Object.keys(itemB).length - Object.keys(itemA).length);
        const temp = {...MaxCompresores};
        delete temp.total;
        this.compresoresNames = Object.keys(temp);
      }
    },
    async fetchEficienciaGenerica() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getEficienciaMermaGenerica`, {fecha: this.fecha, suc: this.suc, turno: this.turno});
      this.eficienciaByTipos = response.data;
    },
    async fetchVariablesCombinadas() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getVariablesCombinadas`, {suc: this.suc});
      this.variablesCombinadas = response.data;
    },
    async fetchEmpleados() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getPersonal`, {suc: this.suc, turno: this.turno});
      this.empleados = response.data;
    }
  },
  computed: {
    startDay() {
        const date = new Date(this.fecha);
        return new Date(date.setDate(date.getDate() - (date.getDay() - 1))).getDate();
    },
    sabado() {
      return this.plusDay(this.startDay, -2);
    },
    domingo() {
      return this.plusDay(this.startDay, -1);
    },
    lunes() {
      return this.startDay;
    },
    martes() {
      return this.plusDay(this.startDay, 1);
    },
    miercoles() {
      return this.plusDay(this.startDay, 2);
    },
    jueves() {
      return this.plusDay(this.startDay, 3);
    },
    viernes() {
      return this.plusDay(this.startDay, 4);
    },
    days() {
      return [this.sabado, this.domingo, this.lunes, this.martes, this.miercoles, this.jueves, this.viernes]
    }
  },
   components: {
    'porcentaje-eficiencia': porcentajeEficiencia,
    'eficiencia-generica': eficienciaGenerica,
    'salario-comision': salarioComision,
  }
}
</script>
<style lang="scss">
  .bold { 
    font-weight: bold;
  }
  tr.center {
    td {
      text-align: center;;
    }
    .left-align {
      text-align: left;
    }
  }
  .bb-0 {
    border-bottom: none !important;
  }
  .bg-gray {
    background: #F4F4F4;
  }
  .collapsible-body {
    overflow: auto;
  }
</style>
