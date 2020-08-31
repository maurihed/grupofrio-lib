<template>
  <table>
    <thead>
      <tr>
        <td colspan="9" class="center bold">{{tipo}}</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(variable, name) in cleanVars" :key="name">
        <td width="25%">{{name}}</td>
        <td class="center" v-for="day in days" :key="day">{{getValue(variable, day)}}</td>
        <td class="center disabled">{{variable.total}}</td>
      </tr>
      <tr>
        <td>Eficiencia</td>
        <td class="center" v-for="day in days" :key="day" v-html="getEficiencia(day)"></td>
        <td class="center" v-html="getTotalEficiencia()"></td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import variablesVue from './variables.vue';
import { getDate } from '../../assets/js/utilities';

export default {
  props: ['tipo','variables', 'days', 'esperado', 'fecha'],
  data() {
    return {};
  },
  methods: {
    getValue(variable, day) {
      const fecha = `F${getDate(this.fecha, this.days, String(day))}`;
      return Number(variable[fecha]);
    },
    getEficiencia(day, asNumber = false) {
      const [key] = Object.keys(this.variables);
      const value = this.variables[key][`F${getDate(this.fecha, this.days, String(day))}`];
      const porcentaje = value ? (value / this.esperado) * 100 : 0;
      if (asNumber) {
        return Number(porcentaje);
      }
      return this.porcentajeToString(porcentaje);
    },
    getTotalEficiencia() {
      const porcentaje = this.days.reduce((total,day) => total + this.getEficiencia(day, true),0) / 7;
      return this.porcentajeToString(porcentaje);;
    },
    porcentajeToString(porcentaje) {
      return porcentaje < 50 ? `<span class="red-text">${porcentaje.toFixed(2)} %</span>`:`<span class="green-text">${porcentaje.toFixed(2)} %</span>`;
    }
  },
  computed: {
    cleanVars() {
      const vars = Object.assign(this.variables);
      delete vars.total;
      return vars;
    }
  },
}
</script>