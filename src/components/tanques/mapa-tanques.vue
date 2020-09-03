<template>
<div>
  <div class="mapaTanque__header">
    <h4>{{tanqueObj.Nombre}}</h4>
  </div>
  <div class="tanque">
    <div v-for="col in (Number(detalleTanque.n_columnas) + 1)" :key="col" :class="{ 'num-col': col === 1, 'col': col > 1 }">
      <div v-if="col > 1" class="col-header">{{numberToLetter(col - 1)}}</div>
      <div v-if="col === 1">
        <div v-for="r in Number(detalleTanque.n_filas)" :key="r" >{{r}}</div>
      </div>
      <div v-if="col > 1">
        <div
          v-for="r in Number(detalleTanque.n_filas)"
          :key="r"
          :class="{
            'canastilla': true,
            'descompuesta': !!descompuesto(r, col-1),
            'deshabilitada': !!endTime(r, col-1),
            'menosDe1': !descompuesto(r, col-1) && lessThanOne(r, col-1) && !!isDisabled(r, col-1),
            'disponible': !descompuesto(r, col-1) && !!endTime(r, col-1) && !isDisabled(r, col-1),
          }"
        >
          <span
            v-if="!!endTime(r, col-1) && !descompuesto(r, col-1)"
            class="casilla__text"
          >
          <v-timer
            :endTime="endTime(r, col-1)"
            :on-timeout="timeoutHandler"
          ></v-timer>
          </span>
          <span
            v-if="!!descompuesto(r, col-1)"
            class="casilla__text"
          >
          {{ descompuesto(r, col-1) }}
          </span>
          <div v-for="celda in Number(detalleTanque.n_canastillas)" :key="celda" class="celda"></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { numberToLetter } from '../../assets/js/utilities.js';
import timerVue from '../configuracion/turnos/timer.vue';

export default {
  props: ['tanque'],
  data() {
    return {
      detalleTanque: {
        n_columnas: 0,
        n_filas: 0,
        n_canastillas: 0,
      },
      tanqueObj: {},
      blackList: [],
      cajonesDeshabilitados: [],
    };
  },
  async created() {
    const tanque = JSON.parse(this.tanque);
    this.tanqueObj = tanque;
    const response = await axios.post(`${env.TANQUE_PRODUCCION}?option=getDetalleTanque`, { idTanque: tanque.idMaquinas });
    const res = await axios.post(`${env.TANQUE_PRODUCCION}?option=getCeldasBloqueadas`, { idTanque: tanque.idMaquinas });
    const cajonesDeshabilitadosResponse = await axios.post(`${env.TANQUE_PRODUCCION}?option=getCajonesDeshabilitados`, { idTanque: tanque.idMaquinas });
    this.blackList = res.data;
    this.cajonesDeshabilitados = cajonesDeshabilitadosResponse.data;
    this.detalleTanque = response.data[0];
  },
  methods:{
    numberToLetter(v) { 
      return numberToLetter(v);
    },
    timeoutHandler() {
      console.log('asdf');
    },
    endTime(x, y) {
      const celda = this.blackList.find((cell) => cell.fila == x && cell.columna == y);
      const tiempo = celda ? celda.fin_bloqueo : false;
      let total = 0;
      if (!!tiempo) {
        total = Date.parse(new Date(tiempo)) - Date.parse(new Date());
      }
      return tiempo;
    },
    isDisabled(x, y) {
      const celda = this.blackList.find((cell) => cell.fila == x && cell.columna == y);
      if (celda) {
        const { fin_bloqueo: tiempo } = celda;
        let total = 0;
        total = Date.parse(new Date(tiempo)) - Date.parse(new Date());
        return total >= 0;
      }
      return false;
    },
    descompuesto(x, y) {
      const cajon = this.cajonesDeshabilitados.find((cajon) => cajon.fila == x && cajon.columna == y);
      if (!cajon) return '';
      return cajon.motivo;
    },
    lessThanOne(x, y) {
      const endTime = this.endTime(x,y);
      if (endTime) {
        let total = 0;
        total = Date.parse(new Date(endTime)) - Date.parse(new Date());
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
<style lang="scss">
.mapaTanque__header {
    text-align: center;
    color: #2e3b8d;
    border-bottom: 3px solid #88a0c2;
    margin-bottom: 20px;
}
.tanque {
  display: flex;
  justify-content: space-between;
}
.num-col {
  width: 40px;
  font-size: 1.5rem;
  line-height: 35px;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-top: 45px;
  color: #828388;
  font-weight: bold;;
  div {
    margin-bottom: 20px;
  }
}
.col {
  width: 100%;
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 1rem;
  margin: 0 1rem;
  background: #e6eaf3;
}
.col .canastilla {
  margin-bottom: 20px;
  background: #8da0bc;
  border-radius: 5px;
  display: flex;
  padding: 6px;
  position: relative;
  .casilla__text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    text-overflow: ellipsis;
    overflow: hidden;
    widows: 100%;
  }
  .celda {
    margin: 0 3px;
    height: 23px;
    flex: 1;
    display: flex;
    justify-content: space-around;
    border-radius: 5px;
    background: #cbd1e1;
  }
  &.deshabilitada {
    background: #b5290e;
    .celda {
      background: #b5290e;
    }
    .casilla__text {
      color: #BABABA;
    }
    &.menosDe1 {
      background: #fbcc3e;
      .celda {
        background: #fbcc3e;
      }
      .casilla__text {
        color: black;
      }
    }
  }
  &.disponible {
    background: #008338;
    .celda {
      background: #008338;
    }
    .casilla__text {
        color: black;
      }
  }
  &.descompuesta {
    background: #c2c2c2;
    .celda {
      background: #c2c2c2;
    }
  }
}
.col-header {
  color: #828388;
  font-weight: bold;;
}
</style>