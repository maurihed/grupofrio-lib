<template>
  <div class="comision-row text-normal" v-if="turnos && turnos.length > 0">
    <div class="input-field col s12">
    <select @change="onTurnoChange($event.target)">
      <option v-for="turno in turnos" :key="turno.id" :value="turno.id">{{turno.nombre | nombreVariable}}</option>
    </select>
  </div>
    <div class="name text-left">{{name}}</div>
    <div class="day-value">{{kilos | number}}</div>
    <div class="day-value">{{actualPrecioKilo | number}}</div>
    <div class="day-value">{{comision | money}}</div>
    <div class="day-value">{{puntos | number}}</div>
    <div class="day-value" :class="(eficienciaProduccion < 50) ? 'wrong-item':'success-item'">{{eficienciaProduccion}} %</div>
    <div class="day-value">{{comisionFinal | money}}</div>
    <div class="day-value">{{sueldoBase | money}}</div>
    <div class="day-value">{{nomina | money}}</div>
  </div>
</template>
<script>
export default {
  props:['name', 'kilos', 'precioKilo','precioKiloVariable','eficiencia', 'sueldoBase', 'puntos', 'eficienciaProduccion', 'turnos', 'handleTurnoChange', 'tipo'],
  mounted() {
    M.FormSelect.init(document.querySelectorAll('select'));
  },
  methods: {
    onTurnoChange(elmt) {
      this.handleTurnoChange(this.tipo, elmt.value);
    }
  },
  computed: {
    actualPrecioKilo() {
      return this.puntos >= 90 ? this.precioKiloVariable : this.precioKilo;
    },
    comision() {
      return Number((this.kilos * this.actualPrecioKilo).toFixed(2));
    },
    comisionFinal() {
      return Number(((this.puntos / 100) * this.comision).toFixed(2));
    },
    nomina() {
      if(this.eficienciaProduccion >= 95) {
        return Number(this.sueldoBase + this.comisionFinal);
      }
      return Number(this.sueldoBase);
    }
  },
  filters: {
  number(value) {
    if (!value) return 0;
    return new Intl.NumberFormat("es-MX").format(value);
  },
  money(value) {
    if (!value) return 0;
    const formatter = new Intl.NumberFormat('en-MX', {
      style: 'currency',
      currency: 'MXN',
    });
    const money = formatter.format(value);

    return money.substr(2);
  }
  },
  filters: {
    nombreVariable(nombre) {
      if (!nombre) return '';
      const [,nombre2] = nombre.split('-');
      return nombre2.trim();
    }
  },
}
</script>
<style lang="scss" scoped>
  .select-wrapper input.select-dropdown {    
    padding-left: 0 !important;
    font-size: 12px;
  }
  .text-normal {
    font-weight: normal;
    color: gray;
  }
  .text-left {
    text-align: left;
  }
  .wrong-item {
    background: #FFaaaa;
    color: #FF4040;
  }
  .success-item {
    background: #cddecd;
    color: #409940;
  }
</style>