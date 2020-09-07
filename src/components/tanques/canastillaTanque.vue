<template>
  <button
    :class="{
      'canastilla': true,
      'descompuesta': !!descompuesto,
      'deshabilitada': !!timeOut,
      'menosDe1': !descompuesto && lessThanOne && !!deshabilitado,
      'disponible': !descompuesto && !!timeOut && !deshabilitado,
      'disabled': !!deshabilitado || !!descompuesto || !selectable,
    }"
    @click="handleClick"
  >
    <span
      v-if="!!timeOut && !descompuesto"
      class="canastilla__text"
    >
    <v-timer
      :endTime="timeOut"
      :on-timeout="()=>{}"
    ></v-timer>
    </span>
    <span
      v-if="!!descompuesto"
      class="canastilla__text"
    >
    {{ descompuesto }}
    </span>
    <div v-for="celda in Number(celdas)" :key="celda" class="celda"></div>
  </button>
</template>
<script>
import timerVue from '../configuracion/turnos/timer.vue';

export default {
  props:['selectable','onClick','fila','col','descompuestas','deshabilitadas', 'celdas'],
  computed: {
    descompuesto() {
      const canastilla = this.descompuestas.find((canastilla) => canastilla.fila == this.fila && canastilla.columna == this.col);
      if (!canastilla) return '';
      return canastilla.motivo;
    },
    timeOut() {
      const celda = this.deshabilitadas.find((canastilla) => canastilla.fila == this.fila && canastilla.columna == this.col);
      const tiempo = celda ? celda.fin_bloqueo : false;
      let total = 0;
      if (!!tiempo) {
        total = Date.parse(new Date(tiempo)) - Date.parse(new Date());
      }
      return tiempo;
    },
    lessThanOne() {
      if (this.timeOut) {
        let total = 0;
        total = Date.parse(new Date(this.timeOut)) - Date.parse(new Date());
        return total <= 3600000;
      }
      return false;
    },
    deshabilitado() {
      const celda = this.deshabilitadas.find((canastilla) => canastilla.fila == this.fila && canastilla.columna == this.col);
      if (celda) {
        const { fin_bloqueo: tiempo } = celda;
        let total = 0;
        total = Date.parse(new Date(tiempo)) - Date.parse(new Date());
        return total >= 0;
      }
      return false;
    },
  },
  methods: {
    handleClick() {
      this.onClick(this.fila, this.col);
    },
  },
  components: {
    'v-timer': timerVue,
  }
}
</script>
<style lang="scss">
.tanque .col .canastilla {
  width: 100%;
  margin-bottom: 20px;
  background: #8da0bc;
  border-radius: 5px;
  display: flex;
  padding: 5px;
  position: relative;
  cursor: pointer;
  .canastilla__text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    text-overflow: ellipsis;
    overflow: hidden;
    widows: 100%;
    padding: 0 .9rem;
    border-radius: 5px;
  }
  .celda {
    margin: 0 3px;
    height: 24px;
    flex: 1;
    display: flex;
    justify-content: space-around;
    border-radius: 5px;
    background: #cbd1e1;
  }
  &.deshabilitada {
    background: #9c1f07;
    .celda {
      background: #e0705a;
    }
    .canastilla__text {
      color: #000;
      background: #e0705a;
    }
    &.menosDe1 {
      background: #e79e14;
      .celda {
        background: #f9cc3d;
      }
      .canastilla__text {
        color: black;
        background: #f9cc3d;;
      }
    }
  }
  &.disponible {
    background: #00813d;
    .celda {
      background: #01c149;
    }
    .canastilla__text {
        color: #000;
        background: #01c149;
      }
  }
  &.descompuesta {
    background: #c2c2c2;
    .celda {
      background: #c2c2c2;
    }
  }
}
</style>