<template>
  <div class="input-field">
    <select v-model="turnoActual" @change="setTurno">
      <option v-for="turno in turnos" :key="turno.id" :value="turno.id">{{turno.nombre}}</option>
    </select>
    <label>Turno</label>
  </div>
</template>
<script>
export default {
  name: 'turnoSelect',
  props: ['empleado','turnos','turno'],
  data(){
    return {
      turnoActual: "0",
      instance: null,
    }
  },
  created() {
    this.turnoActual = this.turno;
  },
  mounted() {
    var instances = M.FormSelect.init(document.querySelectorAll('select'), {});
  },
  methods: {
    async setTurno() {
      await axios.post(`${env.CONFIGURACION_TURNO}?option=setTurnoEmpleado`, { id: this.empleado, turno_id: this.turnoActual });
    }
  }
}
</script>