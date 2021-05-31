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
    <div class="card m-0 mb-1 p-1" v-for="(empleados, puesto) in puestos" :key="puesto">
      <h6 class="center text-bold primary">{{puesto}}</h6>
        <div class="border rounded mb-1" v-for="empleado in empleados" :key="empleado.id">
          <div class="d-flex align-center flex-wrap">
            <span class="text-bold secondary px-1 flex-grow-1">{{empleado.nombre}} - {{empleado.id}}</span>
              <turno-select
                :empleado="empleado.id"
                :turnos="turnos"
                :turno="empleado.turno_id"
                :key="'turno-select-'+empleado.id"
              >
              </turno-select>
          </div>
        </div>
    </div>
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