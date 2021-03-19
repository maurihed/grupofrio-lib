<template>
<div class="mapaTanque">
  <pre>{{detalleTanque}}</pre>
  <div class="mapaTanque__header">
    <h4>{{tanque.Nombre}}</h4>
  </div>
  <div class="tanque">
    <div class="tanque__col" v-for="col in Number(detalleTanque.n_columnas) + 1" :key="'col-'+col" >
      {{col}}
      <span v-if="col === 1">
        <div class="tanque__number" v-for="r in Number(detalleTanque.n_filas)" :key="'n-'+r">{{r}}</div>
      </span>
      <div v-if="col > 1" class="tanque__row"></div>
    </div>
  </div>
</div>
</template>
<script>
import { numberToLetter } from '../../assets/js/utilities';
export default {
  props: ['tanque'],
  data() {
    return {
      detalleTanque: {
        n_columnas: 0,
        n_filas: 0,
      },
    };
  },
  async created() {
    const tanque = JSON.parse(this.tanque);
    const response = await axios.post(`${env.TANQUE_PRODUCCION}?option=getDetalleTanque`, { idTanque: tanque.idMaquinas });
    this.detalleTanque = response.data[0];
  },
  methods:{
    numberToLetter(v) { 
      return numberToLetter(v);
    },
    endTime(x, y) {
      const celda = this.blackListD.find((cell) => cell.fila == x && cell.columna == y);
      const tiempo = celda ? celda.fin_bloqueo : false;
      let total = 0;
      if (!!tiempo) {
        total = Date.parse(new Date(tiempo)) - Date.parse(new Date());
      }
      return tiempo;
    }
  }
  
}
</script>
<style lang="scss" scoped>
  .mapaTanque__header {
    text-align: center;
    color: #2e3b8d;
    border-bottom: 3px solid #88a0c2;
  }
  .tanque {
    border: 2px solid;
    border-radius: 5px;
    background: transparent;
    padding: 10px;
    padding-top: 20px;
    display: flex;
    width: 100%;
    justify-content: space-around;
    &__number {
      width: 20%;
      background: chocolate;
      height: 30px;
    }
  }
</style>