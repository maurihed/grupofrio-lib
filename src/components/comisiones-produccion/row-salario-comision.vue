<template>
  <div class="comision-row text-normal">
      <div class="name">{{name}}</div>
      <div class="day-value">{{kilos | number}}</div>
      <div class="day-value">{{precioKilo | number}}</div>
      <!-- <div class="day-value">{{comision | money}}</div> -->
      <div class="day-value">{{puntos | number}}</div>
      <div class="day-value" :class="(eficiencia < 50) ? 'wrong-item':'success-item'">{{eficiencia}} %</div>
      <div class="day-value">{{comisionFinal | money}}</div>
      <div class="day-value">{{sueldoBase | money}}</div>
      <div class="day-value">{{nomina | money}}</div>
    </div>
</template>
<script>
export default {
  props:['name', 'kilos', 'precioKilo','eficiencia', 'sueldoBase'],
  computed: {
    puntos() {
      return 0;
    },
    comision() {
      return Number((this.kilos * this.precioKilo).toFixed(2));
    },
    comisionFinal() {
      return Number(((this.eficiencia / 100) * this.comision).toFixed(2));
    },
    nomina() {
      return Number(this.sueldoBase + this.comisionFinal);
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
}
</script>
<style lang="scss">
  .text-normal {
    font-weight: normal;
    color: gray;
  }
</style>