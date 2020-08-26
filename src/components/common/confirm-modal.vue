<template>
  <div class="confirmModal">
    <div :id="id" class="modal">
      <div class="modal-content">
        <p class="message center">{{confirmMessage}}</p>
      </div>
      <div class="confirmModal__footer">
          <a href="#" class="actionButton" @click="confirm">{{confirmText}}</a>
          <a href="#" class="actionButton no" @click="closeModal">No</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    targetId: {
      type: Number,
      required: true
    },
    confirmUrl: {
      type: String,
      required: true
    },
    confirmMessage: {
      type: String,
      default: '¿Estás seguro de borrar este elemento?'
    },
    confirmText: {
      type: String,
      default: 'Sí'
    },
    onConfirm: {
      required: true,
      type: Function,
    }
  },
  mounted() {
    M.Modal.init(document.querySelector('.modal'),);
  },
  methods: {
    closeModal() {
      M.Modal.getInstance(document.getElementById(this.id)).close();
    },
    confirm() {
      axios.post(this.confirmUrl,{ maquina: this.targetId })
        .then(response => {
           if (response.statusText) {
              const data = response.data;
              this.onConfirm(this.targetId, data);
           } else {
              M.toast({
                html: "Error inesperado, intentelo de nuevo mas tarde.",
                classes: "red darken-4",
                outDuration: 2000,
              });
           }
        })
        .catch(function (error) {
          M.toast({
            html: "Error inesperado, intentelo de nuevo mas tarde.",
            classes: "red darken-4",
            outDuration: 2000,
          });
        }).finally(() => {
          this.closeModal();
        });
    }
  }
}
</script>

<style lang="scss">
  .confirmModal {
   .modal{
      overflow-y: visible;
      padding: .5em;
      border-radius: 5px;
      color: #FF882E;
      border: medium solid #FF882E;
      max-width: 20rem;
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
}
</style>