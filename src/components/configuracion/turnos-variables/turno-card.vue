<template>
  <div class="border rounded mb-1">
      <div class="d-flex align-center flex-wrap justify-content-around">
        <span class="text-bold secondary px-1">{{newTurno.nombre}}</span>
        <div class="input-field input-filed-small m-0">
          <input :id="newTurno.nombre+'startTime'" type="text" class="timepicker" @change="onChange($event.target.value, 'hora_inicial')" :value="newTurno.hora_inicial | hour">
          <label :for="newTurno.nombre+'startTime'">Hora inicial</label>
        </div>
        <div class="input-field input-filed-small m-0">
          <input :id="newTurno.nombre+'endTime'" type="text" class="timepicker" @change="onChange($event.target.value, 'hora_final')" :value="newTurno.hora_final | hour">
          <label :for="newTurno.nombre+'endTime'">Hora final</label>
        </div>
        <div>
          <button @click="onClick" class="btn-floating btn-small mx-1"><i class="material-icons">save</i></button>
          <button @click="handleDelete" class="btn-floating btn-small mx-1 red darken-4"><i class="material-icons">delete</i></button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'turno-card',
  props: ['turno', 'onSave', 'onUpdate', 'onDelete'],
  data: ()=>({
    newTurno: null,
  }),
  created() {
    this.newTurno = {...this.turno}
  },
  mounted() {
    M.Timepicker.init(document.querySelectorAll('.timepicker'),);
    M.updateTextFields();
  },
  updated() {
    M.updateTextFields();
  },
  methods: {
    onClick() {
      if(this.turno.id) {
        this.onUpdate({...this.turno, hora_inicial: this.newTurno.hora_inicial, hora_final: this.newTurno.hora_final});
      } else {
        this.onSave(this.newTurno);
      }
    },
    handleDelete() {
      this.onDelete(this.turno.id);
      this.newTurno.hora_inicial = null;
      this.newTurno.hora_final = null;
    },
    to24Format(time) {
      const date = new Date(`2020-12-05 ${time}`);
      return `${String(date.getHours()).padStart(2,0)}:${String(date.getMinutes()).padStart(2,0)}`;
    },
    onChange(value, name) {
      this.newTurno[name] = this.to24Format(value);
    }
  },
}
</script>
