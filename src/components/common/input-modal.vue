<template>
  <div class="inputModal">
    <div :id="id" class="modal d-flex f-column">
      <div class="modal-content">
        <h4 class="message center">{{title}}</h4>
        <div v-if="!hideInput" class="input-field col s12">
          <input id="filed" v-model="inputValue" type="text" class="validate">
          <label for="first_name">{{inputLabel}}</label>
        </div>
      </div>
      <div class="confirmModal__footer">
          <a href="#" class="actionButton no" @click="closeModal">{{cancelButton}}</a>
          <a href="#" class="actionButton" @click="confirm">{{confirmButton}}</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cancelButton: {
      type: String,
      default: 'Cancelar'
    },
    confirmButton: {
      type: String,
      default: 'Continuar'
    },
    id: String,
    title: String,
    inputLabel: String,
    defaultValue: String,
    onConfirm: Function,
    onClose: Function,
    isOpen: {
      type: Boolean,
      default: false,
    },
    hideInput: {
      type: Boolean,
      default: false,
    }
  },
  created() {
    this.inputValue = this.defaultValue;
  },
  mounted() {
    M.Modal.init(document.getElementById(this.id), {
      onCloseEnd: this.closeModal,
    });
    M.updateTextFields();
  },
  watch:{
    isOpen() {
      if (this.isOpen) {
        M.Modal.getInstance(document.getElementById(this.id)).open()
      } else {
        M.Modal.getInstance(document.getElementById(this.id)).close()
      }
    },
  },
  data() {
    return {
      inputValue: '',
    };
  },
  methods: {
    closeModal() {
      this.onClose();
    },
    confirm() {
      this.onConfirm(this.inputValue);
    }
  },
}
</script>
<style lang="scss" scoped>
  .inputModal {
   .modal{
      overflow-y: visible;
      padding: .5em;
      border-radius: 5px;
      color: #FF882E;
      border: medium solid #FF882E;
      max-width: 40rem;
  }
  .actionButton {
      box-shadow: 0px 2px 3px #e0e0e0;
      transition: all .25s;
      color: #2D398D;
      font-size: 20px;
      padding: 5px 10px;
      background-color: #FFFFFF;
      box-sizing: inherit;
      &.no {
        color: #FF882E;
      }
  }
  &__footer {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 40px;
    font-weight: bold;
  }
  .d-flex {
    display: flex;
  }
  .f-column {
    flex-direction: column;
  }
}
</style>