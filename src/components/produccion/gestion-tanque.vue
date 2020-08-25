<template>
  <div>
    <div class="panel">
      <div class="row">
        <div class="col l3 m4 s6">
          <div class="input-field">
            <input type="number" id="filas" v-model="filas" class="validate">
            <label for="filas">Filas</label>
          </div>
        </div>
        <div class="col l3 m4 s6">
          <div class="input-field">
            <input type="number" id="columnas" v-model="columnas" class="validate">
            <label for="columnas">Columnas</label>
          </div>
        </div>
        <div class="col l3 m4 s6">
          <div class="input-field">
            <input type="number" id="canastillas" v-model="canastillas" class="validate">
            <label for="canastillas">Canastillas</label>
          </div>
        </div>
        <div class="col l3 m4 s6">
            <div class="input-field">
              <select v-model="tipoBarras">
                <option :value="0" disabled selected>selecciona tipo barra</option>
                <option :value="tipo" v-for="tipo in tiposBarras" :key="tipo">{{tipo}} Kg</option>
              </select>
              <label>Tipo barras</label>
            </div>
        </div>
        <div class="col s12">
          <button class="btn-custom" @click="guardar">Guardar</button>
        </div>
      </div>
    </div>
    <br>
    <tanque-mockup
      v-if="filas > 0 && columnas > 0"
      :filas="filas"
      :columnas="columnas"
      :canastillas="canastillas"
    />
  </div>
</template>
<script>
import { displayMessage, displayError } from '../../assets/js/utilities';
import tanqueMockupVue from './tanque-mockup.vue';

export default {
  props:['suc','tanqueId'],
  data() {
    return {
      filas: 0,
      columnas: 0,
      canastillas: 0,
      tipoBarras: 0,
      tiposBarras:[75,150],
    }
  },
  async created() {
    const response = await axios.post(`${env.TANQUE_PRODUCCION}?option=getDetalleTanque`, { idTanque: this.tanqueId });
    const [tanque] = response.data;
    if (tanque) {
      this.filas = tanque.n_filas;
      this.columnas = tanque.n_columnas;
      this.canastillas = tanque.n_canastillas;
      this.tipoBarras = Number(tanque.tipo_barras);
    }
    M.FormSelect.init(document.querySelectorAll('select'), {});
  },
  methods: {
    async guardar() {
      const request = {
        idTanque: this.tanqueId,
        tanque: {
          'n_filas': this.filas,
          'n_columnas': this.columnas,
          'n_canastillas': this.canastillas,
          'tipo_barras': this.tipoBarras,
        }
      };
      const response = await axios.post(`${env.TANQUE_PRODUCCION}?option=guardarDetalleTanque`, request);
      if (response.data) {
        displayMessage('Guardado correctamente!');
      } else {
        displayError('No se pudo guardar, Intentelo de nuevo mas tarder.');
      }
    }
  },
  components: {
    'tanque-mockup': tanqueMockupVue,
  }
}
</script>