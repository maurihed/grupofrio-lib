<template>
  <button :class="{ 'columna-tanque': true,
  'lessthanone': !desactivado && !!isDisabled && lessThanOne,
  'usedAndAvailable': !desactivado && !!endTime && !isDisabled,
  'disabled': !!isDisabled,
  'disabled desactivado': !!desactivado
  }" @click="irAOrder">
    <span v-if="!!endTime" class="timer">
      <v-timer
        :endTime="endTime"
        :on-timeout="timeoutHandler"
      ></v-timer>
    </span>
    <span v-if="!!desactivado" class="motivo">
      {{desactivado}}
    </span>
    <span v-for="ca in Number(canastillas)" :key="ca" class="tanque__canastilla"></span>
  </button>
</template>
<script>
import timerVue from '../configuracion/turnos/timer.vue';

export default {
  props:['canastillas', 'fila', 'columna', 'onClick', 'blackList', 'cajonesDeshabilitados'],
  data() {
    return {
      blackListD: [],
    };
  },
  created() {
    this.blackListD = this.blackList;
  },
  methods: {
    irAOrder() {
      this.onClick({ fila: this.fila, columna: this.columna, canastillas: this.canastillas });
    },
    timeoutHandler() {
      this.blackListD = this.blackList.filter(cell => !(cell.fila == this.fila && cell.columna == this.columna));
    }
  },
  computed:{
    endTime() {
      const celda = this.blackListD.find((cell) => cell.fila == this.fila && cell.columna == this.columna);
      const tiempo = celda ? celda.fin_bloqueo : false;
      let total = 0;
      if (!!tiempo) {
        total = Date.parse(new Date(tiempo)) - Date.parse(new Date());
      }
      return tiempo;
    },
    isDisabled() {
      const celda = this.blackListD.find((cell) => cell.fila == this.fila && cell.columna == this.columna);
      if (celda) {
        const { fin_bloqueo: tiempo } = celda;
        let total = 0;
        total = Date.parse(new Date(tiempo)) - Date.parse(new Date());
        return total >= 0;
      }
      return false;
    },
    desactivado() {
      const cajon = this.cajonesDeshabilitados.find((cajon) => cajon.fila == this.fila && cajon.columna == this.columna);
      if (!cajon) return '';
      return cajon.motivo;
    },
    lessThanOne() {
      if (this.endTime) {
        let total = 0;
        total = Date.parse(new Date(this.endTime)) - Date.parse(new Date());
        return total <= 3600000;
      }
      return false;
    }
  },
  components: {
    'v-timer': timerVue,
  }
}
</script>
<style lang="scss" scoped>
  .timer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    font-weight: bold;
    font-size: 1.3em;
  }
  .columna-tanque {
    @media (max-width: 353px) {
      margin: 0;
    }
    position: relative;
    margin: 0 10px;
    padding: 10px;
    flex: 1;
    display: flex;
    justify-content: space-around;
    border-radius: 5px;
    cursor: pointer;
    background: #cfd8dc;
    &.usedAndAvailable {
      background: #00c853;
      .tanque__canastilla {
        background: #69f0ae;
        border: 1px solid #00e676;

      }
    }
  }
  .disabled {
    cursor: default;
    background: #ffbfbf;
    .tanque__canastilla {
      background: transparent;
      border: none;
    }
    &.lessthanone {
      background: #ffc400;
    }
  }
  .desactivado {
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

  .tanque__canastilla {
    margin: 0 2px;
    height: 20px;
    border: 2px solid;
    flex: 1;
    display: flex;
    justify-content: space-around;
    border-radius: 5px;
    background: #bbdefb;
  }
</style>