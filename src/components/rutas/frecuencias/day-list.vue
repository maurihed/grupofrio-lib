<template>
  <div class="day-list">
    <day-item v-for="(day, index) in days" :key="index" :frecuencia="getFrecuencia(day)"></day-item>
  </div>
</template>
<script>
import DayItemVue from './day-item.vue'
  export default {
    name: "day-list",
    props:['frecuencias'],
    data: () => ({
      days: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
    }),
    components: {
      'day-item': DayItemVue,
    },
    methods: {
      getFrecuencia(day){
        if (!this.frecuencias.length) return [];
        return this.frecuencias.find(frecuencia => frecuencia.name === day);
      },
    }
  }
</script>

<style lang="scss" scoped>
  
</style>