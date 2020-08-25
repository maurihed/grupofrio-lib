<template>
<div>
  <div class="center" v-if="!isLoaded">
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
    <ul class="collection with-header turno-empleado-overflow-visible" v-for="(empleados, puesto) in puestos" :key="puesto">
      <li class="collection-header title"><h6>{{puesto}}</h6></li>
      <li v-for="empleado in empleados" :key="empleado.id" class="collection-item turno-empleado-row">
        {{empleado.nombre}} - {{empleado.id}}
        <turno-select
          :empleado="empleado.id"
          :turnos="turnos"
          :turno="empleado.turno_id"
          :key="'turno-select-'+empleado.id"
        >
        </turno-select>
      </li>
    </ul>
  </div>
</div>
</template>
<script>
import turnoSelect from './turno-select.vue';

export default {
  props: ['suc'],
  data() {
    return {
      puestos: [],
      turnos: [],
      turno: 0,
      isLoaded: false,
    }
  },
  async created() {
    const puestos = await axios.post(`${env.CONFIGURACION_TURNO}?option=getEmpleados`, { suc: this.suc });
    const turnos = await axios.post(`${env.CONFIGURACION_TURNO}?option=getTurnos`, { suc: this.suc });
    this.puestos = puestos.data;
    this.turnos = turnos.data;
    this.isLoaded = true;
  },
  components: {
    'turno-select': turnoSelect,
  }
}
</script>
<style lang="scss" scoped>
  .turno-empleado-row {
    display: flex;
    justify-content: space-between;
  }
  .turno-empleado-overflow-visible {
    overflow: visible;
  }
</style>