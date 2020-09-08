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
    <input-modal
      id="disableCajon"
      :title="tituloModal"
      inputLabel="Motivo de la deshabilitacion"
      defaultValue="Descompuesta"
      :onConfirm="disableCajon"
      :onClose="closeModal"
      :isOpen="isModalOpen"
      :hideInput="hideInput"
    >
    </input-modal>
    <v-tanque
      v-if="filas > 0 && columnas > 0"
      :filas="filas"
      :columnas="columnas"
      :canastillas="canastillas"
      :deshabilitadas="[]"
      :descompuestas="cajonesDeshabilitados"
      :selecteable="true"
      :descompuestosClikable="true"
      :on-click="openModal"
      :tanque="{ Nombre:'', idMaquinas: this.tanqueId }"
    >
    </v-tanque>
  </div>
</template>
<script>
import { displayMessage, displayError } from '../../assets/js/utilities';
import vTanqueVue from '../tanques/v-tanque.vue';
import tanqueMockupVue from './tanque-mockup.vue';
import inputModalVue from '../common/input-modal.vue';

export default {
  props:['suc','tanqueId'],
  data() {
    return {
      filas: 0,
      columnas: 0,
      canastillas: 0,
      tipoBarras: 0,
      tiposBarras:[75,150],
      cajonesDeshabilitados: [],
      tanque: {},
      cajonSelected: null,
      isModalOpen: false,
      tituloModal: 'Dehabilitar canastilla',
      hideInput: false,
    }
  },
  async created() {
    const response = await axios.post(`${env.TANQUE_PRODUCCION}?option=getDetalleTanque`, { idTanque: this.tanqueId });
    const [tanque] = response.data;
    const cajonesDeshabilitadosResponse = await axios.post(`${env.TANQUE_PRODUCCION}?option=getCajonesDeshabilitados`, { idTanque: this.tanqueId });
    this.cajonesDeshabilitados = cajonesDeshabilitadosResponse.data;
    if (tanque) {
      this.filas = tanque.n_filas;
      this.columnas = tanque.n_columnas;
      this.canastillas = tanque.n_canastillas;
      this.tipoBarras = Number(tanque.tipo_barras);
    }
    M.FormSelect.init(document.querySelectorAll('select'), {});
  },
  methods: {
    closeModal() {
      this.cajonSelected = null;
      this.isModalOpen = false;
      this.hideInput = false;
    },
    openModal(fil, col, id) {
      this.cajonSelected = { fil, col };
      this.tituloModal = `${id ? 'Habilitar' : 'Deshabilitar'} canastilla`;
      this.hideInput = !!id;
      this.isModalOpen = true;
    },
    getId(fila, col) {
      const cajon = this.cajonesDeshabilitados.find((cajon) => cajon.fila == fila && cajon.columna == col);
      if (!cajon) return null;
      return cajon.id;
    },
    async disableCajon(motivo) {
      const id = this.getId(this.cajonSelected.fil, this.cajonSelected.col);
      const url = `${env.TANQUE_PRODUCCION}?option=${id ? 'habilitarCajon' : 'deshabilitarCajon'}`;
      const request = id ? { id } : {
        idTanque: this.tanqueId,
        fila: this.cajonSelected.fil,
        columna: this.cajonSelected.col,
        motivo,
      };
      const response = await axios.post(url, request);
      if (!!Number(response.data)) {
        if (id) {
          this.cajonesDeshabilitados = this.cajonesDeshabilitados.filter((a) => a.id != id);
        } else {
          this.cajonesDeshabilitados.push({
            id: Number(response.data),
            fila: this.cajonSelected.fil,
            columna: this.cajonSelected.col,
            motivo,
          });
        }
      } else {
        displayError('Error inesperado, intentalo mas tarde.');
      }
      this.cajonSelected = null;
      this.isModalOpen = false;
      this.hideInput = false;
    },
    closeModal() {

    },
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
    'v-tanque': vTanqueVue,
    'input-modal': inputModalVue,
  }
}
</script>