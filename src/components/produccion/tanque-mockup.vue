<template>
  <div>
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
    <div class="tanque">
      <div class="tanque__row">
          <div v-for="c in Number(columnas)" :key="'letter'+c"> <span class="cajon-indicator">{{c | letter}}</span></div>
        </div>
      <div v-for="f in Number(filas)" :key="f" class="tanque__row">
        <div class="position-relative">
          <span class="cajon-indicator abosolute-vertical-center">{{f}}</span>
        </div>
        <button @click="openModal(f, c, getId(f,c))" v-for="c in Number(columnas)" :key="c" :class="{'tanque__col': true, 'descompuesto': !!descompuesto(f, c) , 'selected': isSelected(f, c)}">
          <span class="motivo">{{descompuesto(f, c)}}</span>
          <div v-for="ca in Number(canastillas)" :key="ca" class="tanque__canastilla"></div>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import inputModalVue from '../common/input-modal.vue';
import { numberToLetter, displayError } from '../../assets/js/utilities';

export default {
  props:['filas','columnas','canastillas','cajonesDeshabilitados', 'tanqueId'],
  data() {
    return {
      cajonSelected: null,
      isModalOpen: false,
      tituloModal: 'Dehabilitar canastilla',
      cajonesDeshabilitadosM: [],
      hideInput: false,
    };
  },
  created() {
    this.cajonesDeshabilitadosM = this.cajonesDeshabilitados;
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
          this.cajonesDeshabilitadosM = this.cajonesDeshabilitadosM.filter((a) => a.id != id);
        } else {
          this.cajonesDeshabilitadosM.push({
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
    isSelected(fil, col) {
      return this.cajonSelected && fil == this.cajonSelected.fil && col == this.cajonSelected.col;
    },
    descompuesto(fila, col) {
      const cajon = this.cajonesDeshabilitadosM.find((cajon) => cajon.fila == fila && cajon.columna == col);
      if (!cajon) return '';
      return cajon.motivo;
    },
    getId(fila, col) {
      const cajon = this.cajonesDeshabilitadosM.find((cajon) => cajon.fila == fila && cajon.columna == col);
      if (!cajon) return null;
      return cajon.id;
    }
  },
  filters: {
    letter(value) {
      if (!value) return '';
      return numberToLetter(value);
    }
  },
  components: {
    'input-modal': inputModalVue,
  }
}
</script>
<style lang="scss" scoped>
  .tanque {
    border: 2px solid;
    border-radius: 5px;
    background: transparent;
    padding: 10px;
    padding-top: 20px;
      &__row {
      box-sizing: border-box;
      margin-bottom: 20px;
      display: flex;
      width: 100%;
      border-radius: 5px;
      justify-content: space-around;
    }
    &__col {
      @media (max-width: 353px) {
        margin: 0;
      }
      margin: 0 10px;
      border: 2px solid;
      padding: 10px;
      flex: 1;
      display: flex;
      justify-content: space-around;
      border-radius: 5px;
      cursor: pointer;
      background: #cfd8dc;
      &.selected {
        border: 1px solid #FF882E;
      }
    }
    &__canastilla {
      margin: 0 2px;
      height: 20px;
      border: 2px solid;
      flex: 1;
      display: flex;
      justify-content: space-around;
      border-radius: 5px;
      background: #bbdefb;
    }
  
    .descompuesto {
      position: relative;
      background: #B0B0B0;
      .tanque__canastilla {
        background: #B0B0B0;
        border: none;
      }
    }
  
    .motivo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: black;
      text-overflow: ellipsis;
      overflow: hidden;
      widows: 100%;
    }
  }
  .cajon-indicator {
    font-weight: bold;
  }
  .abosolute-vertical-center {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .position-relative {
    position: relative;
  }
</style>