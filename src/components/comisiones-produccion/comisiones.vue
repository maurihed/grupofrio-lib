<template>
  <div>
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
                      :variable="getVariable(1)"
                      :total="getTotalKilos('rolito', d)"
                    >
                    </porcentaje-eficiencia>
                  </td>
                  <td>
                    <porcentaje-eficiencia
                      :variable="getVariable(1)"
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
                      :variable="getVariable(2)"
                      :total="getTotalKilos('barra', d)"
                    >
                    </porcentaje-eficiencia>
                  </td>
                  <td>
                    <porcentaje-eficiencia
                      :variable="getVariable(1)"
                      :total="totalKilosBarras / 7"
                    >
                    </porcentaje-eficiencia>
                  </td>
                </tr>
                <tr> <td colspan="9" class="bb-0 bg-gray"></td> </tr>
                <tr class="center">
                  <td class="left-align">Kilos agua</td>
                  <td v-for="d in days" :key="d">
                    {{getTotalKilos('agua', d) | number}}
                  </td>
                  <td>{{totalLitrosAgua | number}}</td>
                </tr>
                <tr class="center">
                  <td class="left-align">Eficiencia</td>
                  <td v-for="d in days" :key="d">
                    <porcentaje-eficiencia
                      :variable="getVariable(14)"
                      :total="getTotalKilos('agua', d)"
                    >
                    </porcentaje-eficiencia>
                  </td>
                  <td>
                    <porcentaje-eficiencia
                      :variable="getVariable(1)"
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
                  <td>{{getFallasProduccion(sabado)}}</td>
                  <td>{{getFallasProduccion(domingo)}}</td>
                  <td>{{getFallasProduccion(lunes)}}</td>
                  <td>{{getFallasProduccion(martes)}}</td>
                  <td>{{getFallasProduccion(miercoles)}}</td>
                  <td>{{getFallasProduccion(jueves)}}</td>
                  <td>{{getFallasProduccion(viernes)}}</td>
                  <td>{{totalFallasProduccion()}}</td>
                </tr>
                <tr>
                  <td>Numero de fallas solucionadas</td>
                  <td>0</td><td>0</td><td>0</td><td>0</td>
                  <td>0</td><td>0</td><td>0</td><td>0</td>
                </tr>
                <tr>
                  <td>Eficiencia</td>
                  <td>0</td><td>0</td><td>0</td><td>0</td>
                  <td>0</td><td>0</td><td>0</td><td>0</td>
                </tr>
              </tbody>
            </table>
        </div>
      </li>
    </ul>
    <ul class="collapsible popout">
      <li>
        <div class="collapsible-header"><i class="material-icons">radio_button_checked</i>Rendimientos</div>
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
                  <td class="center" v-html="getEficienciaTotalAgua()"></td>
                </tr>
                 <tr> <td colspan="9" class="bb-0 bg-gray"></td> </tr>
              </tbody>
              <thead>               
                <tr>
                  <td colspan="9" class="center bold">Aceite</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="compresor in compresoresBySucursal" :key="compresor.id">
                  <td>{{compresor.descripcion}}</td>
                  <td class="center" v-for="day in days" :key="day">{{getConsumoCompresor(compresor.id, day)| number}}</td>
                  <td class="center disabled">{{getConsumoTotalCompresor(compresor.id)}}</td>
                </tr>
                <tr>
                  <td>Horas trabajadas</td>
                  <td class="center" v-for="day in days" :key="day">8</td>
                  <td class="center disabled">{{56 | number}}</td>
                </tr>
                <tr>
                  <td>Consumo maximo L</td>
                  <td class="center" v-for="day in days" :key="day">{{valorVariable('Consumo maximo aceite') * compresoresBySucursal.length}}</td>
                  <td class="center disabled">{{valorVariable('Consumo maximo aceite') * compresoresBySucursal.length * 7 | number}}</td>
                </tr>
                <tr>
                  <td>Eficiencia</td>
                  <td class="center" v-for="day in days" :key="day" v-html="getEficienciaAceite(day)"></td>
                  <td class="center" v-html="getEficienciaTotalAceite()"></td>
                </tr>
                 <tr> <td colspan="9" class="bb-0 bg-gray"></td> </tr>
              </tbody>
            </table>
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
  </div>
</template>
<script>
import porcentajeEficiencia from './porcentajeEficiencia.vue';
import rowRendimientoMerma from './rowRendimientoMerma.vue';
export default {
  data() {
    return {
      productos: [],
      data: {},
      totalKilosBarras: 0,
      totalKilosRolitos: 0,
      totalLitrosAgua: 0,
      variables: [],
      fallas_produccion: [],
      variablesMerma: [],
      tiposMerma: [],
      rendimientoMerma: [],
      compresores: [],
      compresoresBySucursal: 0,
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
    this.fetchVariablesComisiones();
    this.fetchProduccion();
    this.fetchFallasProduccion();
    this.fetchBitacoraMerma();
    this.fetchTiposMerma();
    this.fetchIncidenciasLimpieza();
    this.fetchProblemasMaquinaria();
    this.fetchCompresores();
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
    getDate(day) {
      const d = new Date();
      const month = String(d.getMonth() + 1).padStart(2, 0);
      const year = d.getFullYear();
      return `${year}-${month}-${day.padStart(2,0)}`;
    },
    plusDay(currentDay, day) {
      const newDate = this.fecha.slice(0,-2) + (currentDay + "").padStart(2, 0);
      const date = new Date(newDate);
      return new Date(date.setDate(date.getDate() + 1 + day)).getDate();
    },
    getPeso(day, fechas) {
      const producto = fechas.find(f => new Date(f.DocDate).getDate() == day);
      return producto ? producto.TOTAL : 0;
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
    getFallasProduccion(day) {
      const D = new Date();
      const year = D.getFullYear();
      const month = String(D.getMonth() + 1).padStart(2, 0);
      const date = `${year}-${month}-${day}`;
      const current = this.fallas_produccion.find(item => item.fecha == date);
      return current ? current.cantidad : 0;
    },
    totalFallasProduccion() {
      if (!this.fallas_produccion) {
        return 0;
      }
      return this.fallas_produccion.reduce((total, fecha) => total + Number(fecha.cantidad), 0);
    },
    getIncidenciasLimpieza(day, tipo) {
      const fecha = this.getDate(String(day));
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
    getEficienciaTotalDeIncidencias() {
      const total = this.days.reduce((total, day) => total + this.getEficienciaDeIncidencias(day, true), 0);
      const porcentaje = total / 7;
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje} %</span>`;
    },
    getProblemasMecanicos(day, tipo) {
      const fecha = this.getDate(String(day));
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
    getEficienciaTotalDeProblemasMecanicos() {
      const total = this.days.reduce((total, day) => total + this.getEficienciaDeProblemasMecanicos(day, true), 0);
      const porcentaje = total / 7;
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje} %</span>`;
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
    getEficienciaTotalAgua() {
      const porcentaje = this.days.reduce((total, day) => total + this.getEficienciaAgua(day, true), 0) / this.days.length;
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje.toFixed(2)} %</span>`;
    },
    getConsumo(day, tipo = "Agua") {
      const date = this.getDate(String(day));
      const key = Object.keys(this.rendimientoMerma).find(d => d.substr(1) == date);
      if(!key) return 0;
      const variables = this.rendimientoMerma[key].tipos[tipo];
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
      return Number(Math.ceil(total));
    },
    getTotalKgKwh() {
      return this.days.reduce((total, day) => total + this.getKgKwh(day), 0);
    },
    getEficienciaKgKwh(day) {
      const porcentaje = this.valorVariable('Kwh/kg esperado') ? this.getKgKwh(day) / this.valorVariable('Kwh/kg esperado') * 100 : 0;
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje.toFixed(2)} %</span>`;
    },
    getConsumoCompresor(id, day) {
      const date = this.getDate(String(day));
      const compresor = this.compresores.find(a=>a.fecha == date && a.id == id);
      return Number(compresor ? compresor.valor : 0); 
    },
    getConsumoTotalCompresor(id) {
      const total = this.days.reduce((total, day) => total + this.getConsumoCompresor(id, day), 0);
      const porcentaje =  total;
      return porcentaje;
    },
    getEficienciaAceite(day, asNumber = false) {
      const fecha = this.getDate(day+'');
      const compresores = this.compresores.filter(a=>a.fecha === fecha);
      const consumo = compresores.reduce((total, compresor) => total + Number(compresor.valor), 0);
      const maximo = this.valorVariable('Consumo maximo aceite') * this.compresoresBySucursal.length;
      const porcentaje = consumo ? (maximo / consumo) * 100 : 0;
      if (asNumber) {
        return Number(porcentaje);
      }
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje.toFixed(2)} %</span>`;
    },
    getEficienciaTotalAceite() {
      const divisor = 7; 
      const porcentaje =  this.days.reduce((total, day) => total + this.getEficienciaAceite(day, true), 0) / divisor;
      return `<span class="${ porcentaje < 50 ? 'red-text' : 'green-text'}">${porcentaje.toFixed(2)} %</span>`;
    },
    async fetchVariablesComisiones() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getVariables`, { suc: this.suc });
      this.variables = response.data;
      this.variables.forEach(v => v.valor = Number(Number(v.valor).toFixed(3)));
    },
    async fetchProduccion() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getProduccion`,{ fecha: this.fecha, suc: this.suc });
      this.data = response.data;
      this.totalKilosBarras = this.sumTotalKilos('barra');
      this.totalKilosRolitos = this.sumTotalKilos('rolito');
      this.totalLitrosAgua = this.sumTotalKilos('agua');
      this.productos = Object.keys(this.data);
    },
    async fetchFallasProduccion() {
      const fallas_produccion = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getErroresProduccion`, { fecha: this.fecha, suc: this.suc });
      this.fallas_produccion = fallas_produccion.data;
    },
    async fetchBitacoraMerma() {
      const bMerma = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getBitacoraMerma`,{ fecha: this.fecha, suc: this.suc });
      this.rendimientoMerma = bMerma.data;
    },
    async fetchTiposMerma() {
      const tiposMerma = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getTiposMerma`, {suc: this.suc});
      this.tiposMerma = tiposMerma.data;
    },
    async fetchIncidenciasLimpieza() {
      const inicidenciasLimpieza = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getIncidenciasLimpieza`, {fecha: this.fecha, suc: this.suc});
      this.inicidenciasLimpieza = inicidenciasLimpieza.data;
    },
    async fetchProblemasMaquinaria() {
      const problemasMecanicos = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getProblemasMaquinaria`, {fecha: this.fecha, suc: this.suc});
      this.problemasMecanicos = problemasMecanicos.data;
    },
    async fetchCompresores() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getRendimientoAceite`, {fecha: this.fecha, suc: this.suc, turno: this.turno});
      this.compresores = response.data;
      this.compresoresBySucursal = [...new Set(response.data.map(a=>a.id))];
      this.compresoresBySucursal = this.compresores.filter(a=>this.compresoresBySucursal.includes(a.id));
    },
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
    'row-rendimiento-merma': rowRendimientoMerma,
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
</style>
