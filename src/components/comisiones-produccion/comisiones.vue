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
      <br>
      <div>{{(progres * 100 / 14).toFixed(2)}}%</div>
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
                      <td class="center bold">{{'Lunes ('+lunes+')'}}</td>
                      <td class="center bold">{{'Martes ('+martes+')'}}</td>
                      <td class="center bold">{{'Miercoles ('+miercoles+')'}}</td>
                      <td class="center bold">{{'Jueves ('+jueves+')'}}</td>
                      <td class="center bold">{{'Viernes ('+viernes+')'}}</td>
                      <td class="center bold">{{'Sabado ('+sabado+')'}}</td>
                      <td class="center bold">{{'Domingo ('+domingo+')'}}</td>
                      <td class="center bold">TOTAL</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="name in productos" :key="name">
                    <td><span :class="'new badge '+getColor(data[name][0].id)" :data-badge-caption="getType(data[name][0].id)"></span> {{name}}</td>
                    <td class="center">{{getPeso(lunes, data[name]) | number}}</td>
                    <td class="center">{{getPeso(martes, data[name]) | number}}</td>
                    <td class="center">{{getPeso(miercoles, data[name]) | number}}</td>
                    <td class="center">{{getPeso(jueves, data[name]) | number}}</td>
                    <td class="center">{{getPeso(viernes, data[name]) | number}}</td>
                    <td class="center">{{getPeso(sabado, data[name]) | number}}</td>
                    <td class="center">{{getPeso(domingo, data[name]) | number}}</td>
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
                <thead>
                  <tr>
                    <td colspan="9" class="center bold">MERMAS</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Merma</td>
                    <td class="center" v-for="day in fullDays" :key="day.day">
                      <span v-if="merma[day.fullDate]">{{merma[day.fullDate].real | number}}</span>
                      </td>
                    <td class="center">
                      <span>{{merma.totalReal | number}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Porcentaje</td>
                    <td class="center" v-for="day in fullDays" :key="day.day">
                        <span v-if="merma[day.fullDate]">{{merma[day.fullDate].porcentaje}} %</span>
                      </td>
                    <td class="center">
                      <span>{{merma.totalPorcentaje}} %</span>
                    </td>
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
                      <td class="center bold">{{'Lunes ('+lunes+')'}}</td>
                      <td class="center bold">{{'Martes ('+martes+')'}}</td>
                      <td class="center bold">{{'Miercoles ('+miercoles+')'}}</td>
                      <td class="center bold">{{'Jueves ('+jueves+')'}}</td>
                      <td class="center bold">{{'Viernes ('+viernes+')'}}</td>
                      <td class="center bold">{{'Sabado ('+sabado+')'}}</td>
                      <td class="center bold">{{'Domingo ('+domingo+')'}}</td>
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
                    <td>Medición inicial</td>
                    <td class="center" v-for="day in days" :key="day">
                      <span>{{getValorInicialFinal(day, 'valor_inicial')}}</span>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Medición final</td>
                    <td class="center" v-for="day in days" :key="day">
                      <span>{{getValorInicialFinal(day, 'valor_final')}}</span>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Consumo litros</td>
                    <td class="center" v-for="day in days" :key="day">
                      <span>{{getConsumo(day) | number}}</span>
                    </td>
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
                    <td>Medición inicial</td>
                    <td class="center" v-for="day in days" :key="day">
                      <span>{{getValorInicialFinal(day, 'valor_inicial', 'Electricidad', valorVariable('Multiplicador Kwh'))}}</span>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Medición final</td>
                    <td class="center" v-for="day in days" :key="day">
                      <span>{{getValorInicialFinal(day, 'valor_final', 'Electricidad', valorVariable('Multiplicador Kwh'))}}</span>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Consumo</td>
                    <td class="center" v-for="day in days" :key="day">
                      <span>{{valorVariable('Multiplicador Kwh') * getConsumo(day,'Electricidad') | number}}</span>
                    </td>
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
                    <td class="center disabled">{{getConsumonpmTotalCompresor(compresorName)}}</td>
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
              <!-- <eficiencia-generica v-for="(tipo, name) in eficienciaByTipos" :key="name"
                :tipo="name"
                :variables="tipo"
                :days="fullDays"
                :esperado="getValorEsperado(name)"
                :fecha="fecha"
              >
              </eficiencia-generica> -->
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
                      <td class="center bold">{{'Lunes ('+lunes+')'}}</td>
                      <td class="center bold">{{'Martes ('+martes+')'}}</td>
                      <td class="center bold">{{'Miercoles ('+miercoles+')'}}</td>
                      <td class="center bold">{{'Jueves ('+jueves+')'}}</td>
                      <td class="center bold">{{'Viernes ('+viernes+')'}}</td>
                      <td class="center bold">{{'Sabado ('+sabado+')'}}</td>
                      <td class="center bold">{{'Domingo ('+domingo+')'}}</td>
                      <td class="center bold">TOTAL</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-justify">Real</td>
                    <td v-for="day in days" :key="day">{{getDatoMantenimiento(day, 'real')}}</td>
                    <td>{{getDatoTotalMantenimiento('real')}}</td>
                  </tr>
                  <tr>
                    <td class="text-justify">Meta</td>
                    <td v-for="day in days" :key="day">{{getDatoMantenimiento(day, 'meta')}}</td>
                    <td>{{getDatoTotalMantenimiento('meta')}}</td>
                  </tr>
                  <tr>
                    <td class="text-justify">Porcentaje</td>
                    <td v-for="day in days" :key="day">
                      <span class="red-text" v-if="getDatoMantenimiento(day, 'porcentaje') < 50">{{getDatoMantenimiento(day, 'porcentaje')}}%</span>
                      <span class="green-text" v-if="getDatoMantenimiento(day, 'porcentaje') > 50">{{getDatoMantenimiento(day, 'porcentaje')}}%</span>
                    </td>
                    <td>
                      <span :class="{'red-text': getEficienciaTotalMantenimiento() < 50, 'green-text': getEficienciaTotalMantenimiento() > 50}">{{getEficienciaTotalMantenimiento()}} %</span>
                    </td>
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
        :puntos="getTotalPuntos()"
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
export default {
  data() {
    return {
      isLoaded: false,
      progres: 0,
      productos: [],
      data: {},
      fullDays: [],
      totalKilosBarras: 0,
      totalKilosRolitos: 0,
      totalLitrosAgua: 0,
      totalKilos: {},
      variables: [],
      variablesCombinadas: [],
      fallas_produccion: [],
      variablesMerma: [],
      tiposMerma: [],
      rendimientoMerma: [],
      eficienciaCompresores: {},
      compresoresNames: 0,
      eficienciaByTipos: [],
      eficienciaMantenimiento: {},
      merma: {},
      puntos: {},
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
    this.setFullDays();
    this.progres = 0;
    await Promise.allSettled([
        this.fetchVariablesComisiones(),
        this.fetchProduccion(),
        this.fetchFallasProduccion(),
        this.fetchBitacoraMerma(),
        this.fetchTiposMerma(),
        this.fetchIncidenciasLimpieza(),
        this.fetchProblemasMaquinaria(),
        this.fetchCompresores(),
        this.fetchEficienciaGenerica(),
        this.fetchVariablesCombinadas(),
        this.fetchEmpleados(),
        this.fetchTotalKilos(),
        this.fetchEficienciaMantenimiento(),
        this.fetchPuntosProduccion(),
        this.fetchMermaProduccion(),
    ]);
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
    getDate(day) {
      const temp = [...this.fullDays];
      const date = temp.find(a=>a.day==day);
      return date.fullDate;
    },
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
      Object.entries(this.totalKilos[tipo]).forEach(([fecha, val]) => {
        const day2 = fecha.split('-').pop();
        if(day2 == day) {
          total = val;
        }
      });
      return total;
    },
    sumTotalKilos(tipo) {
      return Object.values(this.totalKilos[tipo]).reduce((total, value) => {
        total += (value || 0);
        return total;
      }, 0);
    },
    getVariable(id) {
      return this.variables.find(v => v.id == id);
    },
    porcentajeToString(porcentaje) {
      return porcentaje < 50 ? `<span class="red-text">${porcentaje.toFixed(2)} %</span>`:`<span class="green-text">${porcentaje.toFixed(2)} %</span>`;
    },
    getDataProduccion(day, tipo) {
      const fecha = this.getDate(day);
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
      const fecha = this.getDate(day);
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
      const fecha = this.getDate(day);
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
      const porcentaje = consumoMaximoHielo == 0 ? 0 : ((consumoHielo / consumoMaximoHielo) * 100).toFixed(2);
      if (asNumber) {
        return Number(porcentaje);
      }
      return `<span class="${ porcentaje > 100 ? 'red-text' : 'green-text'}">${porcentaje} %</span>`;
    },
    getEficienciaTotalAgua(asNumber = false) {
      const porcentaje = this.days.reduce((total, day) => total + this.getEficienciaAgua(day, true), 0) / this.days.length;
      if (asNumber) {
        return porcentaje;
      }
      return `<span class="${ porcentaje > 100 ? 'red-text' : 'green-text'}">${porcentaje.toFixed(2)} %</span>`;
    },
    getConsumo(day, tipo = "Agua") {
      const date = this.getDate(day);
      if(this.rendimientoMerma.length === 0) {
        return 0;
      }
      const variables = this.rendimientoMerma && this.rendimientoMerma[`F${date}`] ? this.rendimientoMerma[`F${date}`].tipos[tipo] : [];
      return variables.reduce((total, item) => {
        const value = item.valor_final ? item.valor_final - item.valor_inicial : item.valor_inicial;
        return total+Number(value)
        }, 0);
    },
    getValorInicialFinal(day, name, tipo = 'Agua', multiplicador = 1) {
      const date = this.getDate(day);
      if(this.rendimientoMerma.length === 0) {
        return 0;
      }
      const { tipos }  = this.rendimientoMerma[`F${date}`] || {tipos: { [tipo]: [] }};
      const variables = tipos[tipo];
      let valor = variables.reduce((total, item) => total + Number(item[name]), 0);
      if (tipo == 'Agua') {
        valor /= 1000;
      }
      return new Intl.NumberFormat("es-MX").format(valor * multiplicador);
    },
    getValorIF(day, tipo = 'Agua', multiplicador = 1) {
      const date = this.getDate(day);
      if(this.rendimientoMerma.length === 0) {
        return 0;
      }
      const variables = this.rendimientoMerma && this.rendimientoMerma[`F${date}`] ? this.rendimientoMerma[`F${date}`].tipos[tipo] : [];
      const valorIF = variables.reduce((total, item) => {
        return {
          inicio: total.inicio + Number(item.valor_inicial),
          final: total.final + Number(item.valor_final),
        }
      }, {inicio: 0, final: 0});
      if (tipo == 'Agua') {
        valorIF.inicio /= 1000;
        valorIF.final /= 1000;
      }
      valorIF.inicio = new Intl.NumberFormat("es-MX").format(valorIF.inicio * multiplicador);
      valorIF.final = new Intl.NumberFormat("es-MX").format(valorIF.final * multiplicador);
      return `I: ${valorIF.inicio} - F: ${valorIF.final}`; 
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
      const date = this.getDate(day);
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
      const fecha = this.getDate(day);
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
    formatDay(date) {
      const d = new Date(date);
      const day = String(d.getDate());
      const month = String(d.getMonth() + 1);
      const year = String(d.getFullYear());
      const formattedDate = `${year}-${month.padStart(2, 0)}-${day.padStart(2, 0)}`;
      return formattedDate;
    },
    setFullDays() {
      // const [year, month, day] = this.fecha.split('-');
      const date = new Date(`${this.fecha} 00:00`);
      const startDate = new Date(date.setDate(date.getDate() - (date.getDay() == 0 ? 6 : (date.getDay() - 1))));
      const days = [-1,0,1,2,3,4,5];
      this.fullDays =  days.map((d) => {
        const tempDate = new Date(date);
        const fullDate = new Date(tempDate.setDate(tempDate.getDate() + 1 + d));
        const day = fullDate.getDate();
        return { day, fullDate: this.formatDay(fullDate) };
      });
    },
    getDatoMantenimiento(day, tipo) {
      let response = 0;
      Object.entries(this.eficienciaMantenimiento).forEach(([fecha, turnos]) => {
        const dayI = new Date(fecha+' 00:00').getDate();
        if (dayI == day) {
            Object.entries(turnos).forEach(([turno, data])=>{
                const [id] = turno.split('-');
                if (id == this.turno) {
                    response = data.mantenimiento[tipo]
                }
            })
        }
      });
      return response;
    },
    getDatoTotalMantenimiento(tipo) {
      return Object.values(this.eficienciaMantenimiento).reduce((total, turnos) => {
        Object.entries(turnos).forEach(([turno, data]) => {
          const [id] = turno.split('-');
          if(id == this.turno) {
            total += data.mantenimiento[tipo];
          }
        });
        return total;
      }, 0);
    },
    getEficienciaTotalMantenimiento() {
      const totalReal = this.getDatoTotalMantenimiento('real');
      const totalMeta = this.getDatoTotalMantenimiento('meta');
      return totalMeta > 0 ? Math.floor((totalReal/totalMeta)*100) : 0;
    },
    getTotalEficiencia() {
      const eficienciaProduccionRollito = this.getEficienciaTotalProduccion('Rollito');
      const eficienciaProduccionBarra = this.getEficienciaTotalProduccion('Barra');
      // const eficienciaProduccionAgua = this.getEficienciaTotalProduccion('Agua');
      // const eficienciaFallasProduccion = this.totalDataProduccion('eficiencia');
      const eficienciaAgua = this.getEficienciaTotalAgua(true);
      const eficienciaEnergia = this.getEficienciaTotalElectricidad(true);
      const eficienciaAceite = this.getEficienciaTotalAceite(true);
      // const eficienciaMermaGenerica = this.getEficienciaTotalMermaGenerica();
      // const eficienciaLimpieza = this.getEficienciaTotalDeIncidencias(true);
      // const eficienciaMecanica = this.getEficienciaTotalDeProblemasMecanicos(true);
      const eficienciaMantenimiento = this.getEficienciaTotalMantenimiento();
      
      const eficiencias = [
        eficienciaProduccionRollito
        ,eficienciaProduccionBarra
        ,((eficienciaAgua - 100) * -1) < 0 ? 0 : ((eficienciaAgua - 100) * -1)
        ,eficienciaEnergia
        ,eficienciaMantenimiento
      ];
      return (eficiencias.reduce((a, b) => a + b, 0) / eficiencias.length).toFixed(2);
    },
    getPuntos(porcentaje, puntos, punto, todoNada = false) {
      if (todoNada) {
        return porcentaje > 89 ? puntos[punto] : 0;
      }
      const totalPuntos = Math.round((porcentaje/100 * puntos[punto])*100)/100;
      return porcentaje > 100 ? puntos[punto] : totalPuntos;
    },
    getTotalPuntos() {
      const eficiencias = {
        produccionRolito: this.getEficienciaTotalProduccion('Rollito'),
        produccionBarra: this.getEficienciaTotalProduccion('Barra'),
        agua: this.getEficienciaTotalAgua(true),
        aceite: this.getEficienciaTotalAceite(true),
        energia: this.getEficienciaTotalElectricidad(true),
        bitacora: this.getEficienciaTotalMantenimiento(),
        fallas: this.totalDataProduccion('eficiencia'),
      }
      const puntos = {
        maquinista: {
          renAgua: eficiencias.agua < 100 ? this.puntos.maquinista['Rendimiento agua'] : 0,
          renEnergia: eficiencias.energia >= 90 ? this.puntos.maquinista['Rendimiento energia'] : 0,
          renAceite: eficiencias.aceite > 90 ? this.puntos.maquinista.Aceite : 0,
          fallas: this.getPuntos(eficiencias.fallas, this.puntos.maquinista, 'Fallas'),
        },
        jefe: {
          renAgua: eficiencias.agua < 100 ? this.puntos.jefe['Rendimiento agua'] : 0,
          renEnergia: eficiencias.energia >= 90 ? this.puntos.jefe['Rendimiento Energia'] : 0,
          fallas: this.getPuntos(eficiencias.fallas, this.puntos.jefe, 'Fallas'),
          bitacora: this.getPuntos(eficiencias.bitacora, this.puntos.jefe, 'Bitacoras'),
          merma: eficiencias.merma < 2 ? this.puntos.jefe.Merma : 0,
        },
        cubero: {
          renAgua: eficiencias.agua < 100 ? this.puntos.cubero['Rendimiento agua'] : 0,
          renEnergia: eficiencias.energia >= 90 ? this.puntos.cubero['Rendimiento Energia'] : 0,
          bitacora: this.getPuntos(eficiencias.bitacora, this.puntos.cubero, 'Bitacora'),
        },
        sacador: {
          renAgua: eficiencias.agua < 100 ? this.puntos.sacador['Rendimiento agua'] : 0,
          renEnergia: eficiencias.energia >= 90 ? this.puntos.sacador['Rendimiento Energia'] : 0,
          bitacora: this.getPuntos(eficiencias.bitacora, this.puntos.sacador, 'Bitacora'),
        },
      }
      return puntos;
    },
    async fetchVariablesComisiones() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getVariables`, { suc: this.suc });
      this.variables = response.data;
      this.variables.forEach(v => v.valor = Number(Number(v.valor).toFixed(3)));
      this.progres++;
    },
    async fetchProduccion() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getProduccion`,{ fecha: this.fecha, suc: this.suc, turno: this.turno });
      this.data = response.data;
      this.productos = Object.keys(this.data);
      this.progres++;
    },
    async fetchFallasProduccion() {
      const fallas_produccion = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getErroresProduccion`, { fecha: this.fecha, suc: this.suc, turno: this.turno });
      this.fallas_produccion = fallas_produccion.data;
      this.progres++;
    },
    async fetchBitacoraMerma() {
      this.progres++;
      const bMerma = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getBitacoraMerma`,{ fecha: this.fecha, suc: this.suc, turno: this.turno });
      this.rendimientoMerma = bMerma.data;
    },
    async fetchTiposMerma() {
      const tiposMerma = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getTiposMerma`, {suc: this.suc});
      this.tiposMerma = tiposMerma.data;
      this.progres++;
    },
    async fetchIncidenciasLimpieza() {
      const inicidenciasLimpieza = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getIncidenciasLimpieza`, {fecha: this.fecha, suc: this.suc, turno: this.turno});
      this.inicidenciasLimpieza = inicidenciasLimpieza.data;
      this.progres++;
    },
    async fetchProblemasMaquinaria() {
      const problemasMecanicos = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getProblemasMaquinaria`, {fecha: this.fecha, suc: this.suc, turno: this.turno});
      this.problemasMecanicos = problemasMecanicos.data;
      this.progres++;
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
      this.progres++;
    },
    async fetchEficienciaGenerica() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getEficienciaMermaGenerica`, {fecha: this.fecha, suc: this.suc, turno: this.turno});
      this.eficienciaByTipos = response.data;
      this.progres++;
    },
    async fetchVariablesCombinadas() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getVariablesCombinadas`, {suc: this.suc});
      this.variablesCombinadas = response.data;
      this.progres++;
    },
    async fetchEmpleados() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getPersonal`, {suc: this.suc, turno: this.turno});
      this.empleados = response.data;
      this.progres++;
    },
    async fetchTotalKilos() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getTotalKilos`, {suc: this.suc, fecha: this.fecha, turno: this.turno});
      this.totalKilos = response.data;

      this.totalKilosBarras = this.sumTotalKilos('barra');
      this.totalKilosRolitos = this.sumTotalKilos('rolito');
      this.totalLitrosAgua = this.sumTotalKilos('agua');
      this.progres++;
    },
    async fetchEficienciaMantenimiento(){
      const response = await axios.post(`${env.REPORTES_CONCENTRADO}?option=produccion`, { fecha: this.fecha, suc: this.suc });
        this.eficienciaMantenimiento = response.data;
        this.progres++;
    },
    async fetchPuntosProduccion() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=puntosProduccion`, { suc: this.suc });
      this.puntos = response.data;
      this.progres++;
    },
    async fetchMermaProduccion() {
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=mermaProduccion`, { fecha: this.fecha, suc: this.suc, turno: this.turno });
      this.merma = response.data;
      this.progres++;
    }
  },
  computed: {
    startDay() {
      const [year, month, day] = this.fecha.split('-');
      const date = new Date(`${month}-${day}-${year}`);
      return new Date(date.setDate(date.getDate() - (date.getDay() + 1))).getDate();
    },
    lunes() {
      return this.fullDays[0].day;
      return this.startDay;
    },
    martes() {
      return this.fullDays[1].day;
      return this.plusDay(this.startDay, 1);
    },
    miercoles() {
      return this.fullDays[2].day;
      return this.plusDay(this.startDay, 2);
    },
    jueves() {
      return this.fullDays[3].day;
      return this.plusDay(this.startDay, 3);
    },
    viernes() {
      return this.fullDays[4].day;
      return this.plusDay(this.startDay, 4);
    },
    sabado() {
      return this.fullDays[5].day;
      return this.plusDay(this.startDay, -2);
    },
    domingo() {
      return this.fullDays[6].day;
      return this.plusDay(this.startDay, -1);
    },
    days() {
      return [this.lunes, this.martes, this.miercoles, this.jueves, this.viernes, this.sabado, this.domingo];
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
  .valor_incial_final {
    display: flex;
    justify-content: center;
    color: #A0A0A0;
  }
</style>
