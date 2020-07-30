<template>
  <div class="turnos">
    <div class="panel">
      <div class="container-fluid">
        <div class="row vertical-center">
            <div class="col s3 align-center">
              <span class="title">Turno Matutino</span>
            </div>
            <div class="col s4">
              <div class="input-field">
                <input id="m-startTime" type="text" class="timepicker" :value="to12Format(matutino && matutino.hora_inicial)">
                <label for="m-startTime">Hora inicial</label>
              </div>
            </div>
            <div class="col s4">
              <div class="input-field">
                <input id="m-endTime" type="text" class="timepicker" :value="to12Format(matutino && matutino.hora_final)">
                <label for="m-endTime">Hora final</label>
              </div>
            </div>
            <div class="col s1 rigth">
              <button class="btn-floating absolute-center" @click="saveTurno('m-')"><i class="material-icons">save</i></button>
            </div>
        </div>
        <div class="row vertical-center">
            <div class="col s3 align-center">
              <span class="title">Turno Vespertino</span>
            </div>
            <div class="col s4">
              <div class="input-field">
                <input id="v-startTime" type="text" class="timepicker" :value="to12Format(vespertino && vespertino.hora_inicial)">
                <label for="v-startTime">Hora inicial</label>
              </div>
            </div>
            <div class="col s4">
              <div class="input-field">
                <input id="v-endTime" type="text" class="timepicker" :value="to12Format(vespertino && vespertino.hora_final)">
                <label for="v-endTime">Hora final</label>
              </div>
            </div>
            <div class="col s1 rigth">
              <button class="btn-floating absolute-center" @click="saveTurno('v-')"><i class="material-icons">save</i></button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['suc'],
  data() {
    return {
      date: '',
      matutino: null,
      vespertino: null,
    }
  },
  async created() {
      const D = new Date();
      const month = String(D.getMonth() + 1).padStart(2,0);
      this.date = `${D.getFullYear()}-${month}-${D.getDate()}`;
      const response = await axios.post(`${env.CONFIGURACION_TURNO}?option=getTurnos`, { suc: this.suc });
      this.matutino = response.data.find((turno) => turno.nombre === 'MATUTINO')
      this.vespertino = response.data.find((turno) => turno.nombre === 'VESPERTINO');
  },
  mounted() {
    const options = {
      i18n: {
        cancel: 'Cancelar',
        clear: 'Limpiar',
        done: 'Hecho',
      }
    };
    M.Timepicker.init(document.querySelectorAll('.timepicker'), options);
  },
  updated() {
        M.updateTextFields();
  },
  methods: {
    showError(text) {
      M.toast({
        html: text,
        classes: "red darken-1",
        outDuration: 2000,
      });
    },
    showMessage(text) {
      M.toast({
        html: text,
        classes: "green accent-1",
        outDuration: 2000,
      });
    },
    biggerThan(inicial, final) {
      return new Date(`${this.date} ${inicial}`) > new Date(`${this.date} ${final}`);
    },
    to24Format(time) {
      const date = new Date(`${this.date} ${time}`);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2,0)}`;
    },
    to12Format(time) {
      if (!time) {
        return '';
      }
      const [hours, minutes] = time.split(':');
      const meridian = hours < 12 ? 'AM': 'PM'; 
      return `${hours%12}:${minutes} ${meridian}`;
    },
    async saveTurno(prefix) {
      let inicial = document.querySelector(`#${prefix}startTime`).value;
      let final = document.querySelector(`#${prefix}endTime`).value;
      if (!inicial) {
        this.showError('La hora inicial es necesaria'); return;
      }
      if (!final) {
        this.showError('La hora final es necesaria'); return;
      }
      // if (this.biggerThan(inicial, final)) {
      //   this.showError('La hora final debe ser mas grande que la inicial'); return;
      // }
      const turno = prefix === 'm-' ? 'MATUTINO' : 'VESPERTINO';
      inicial = this.to24Format(inicial);
      final = this.to24Format(final);
      const request = {
        suc: this.suc,
        hora_inicial: inicial,
        hora_final: final,
        turno,
      };
      const response = await axios.post(`${env.CONFIGURACION_TURNO}?option=saveTurno`, request);
      this.showMessage('Guadado correctamente!');
    },
  }
}
</script>
<style lang="scss">
  .vertical-center {
    display: flex;
    align-content: center;
  }
  .align-center {
    align-self: center;
  }
  .absolute-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .title {
    font-weight: 700;
    color: #989898;
  }
</style>
