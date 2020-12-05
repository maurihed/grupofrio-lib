<template>
  <div>
    <turno-card
      v-for="(turno, index) in turnos"
      :key="index+turno.nombre"
      :turno="turno"
      :onSave="handleSave"
      :onUpdate="handleUpdate"
      :onDelete="handleDelete"
    ></turno-card>
  </div>
</template>

<script>
import { displayError, displayMessage } from '../../../assets/js/utilities';
import TurnoCardVue from './turno-card.vue';

export default {
  name: 'turnos-variables',
  props: ['suc'],
  data: ()=>({
    turnosPosibles: ['MATUTINO', 'VESPERTINO', 'NOCTURNO'],
    turnos: [],
    isLoaded: false,
  }),
  created() {
    this.fethTurnos();
  },
  methods: {
    async fethTurnos() {
      const response = await axios.post(`${env.CONFIGURACION_TURNO_VARIABLES}?option=getTurnos`,{ suc: this.suc });
      this.turnos = this.turnosPosibles.map((turno) => response.data.find(t => t.nombre == turno) || this.emptyTurno(turno));
      this.isLoaded = true;
    },
    async handleSave(turno) {
      const response = await axios.post(`${env.CONFIGURACION_TURNO_VARIABLES}?option=saveTurno`,{ turno });
      const index = this.turnos.findIndex(t => t.nombre == turno.nombre);
      const newTurno = response.data;
      if (newTurno && index != -1) {
        this.turnos[index] = {...newTurno};
        this.turnos = [...this.turnos];
        displayMessage('Turno guardado correctamente');
      } else {
        displayError('No fue posible guardar el turno');
      }
    },
    async handleUpdate(turno) {
      const response = await axios.post(`${env.CONFIGURACION_TURNO_VARIABLES}?option=updateTurno`,{ turno });
      displayMessage('Turno actualizado correctamente');
    },
    async handleDelete(id) {
      const response = await axios.post(`${env.CONFIGURACION_TURNO_VARIABLES}?option=deleteTurno`,{ id });
      const name = response.data;
      const index = this.turnos.findIndex(t => t.nombre == name);
      this.turnos[index] = this.emptyTurno(name);
      this.turnos = [...this.turnos];
      displayMessage('Turno eliminado correctamente');
    },
    emptyTurno(nombre) {
      return {
        id: null,
        nombre,
        hora_inicial: null,
        hora_final: null,
        hora_inicial_n: null,
        hora_final_n: null,
        suc: this.suc
      }
    },
  },
  components: {
    'turno-card': TurnoCardVue,
  }
}
</script>

<style lang="scss" scoped>

</style>