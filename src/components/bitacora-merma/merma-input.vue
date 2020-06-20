<template>
  <div>
    <a class="btn-link center" @click="removeEvaluation" v-if="isEvaluated">
      {{value}} / <span class="text-muted">{{horaComputed | hour}} </span>
    </a>
    <div class="input-field" v-if="!isEvaluated">
      <input placeholder="0" :value="value" @blur="updateValue" type="number" class="validate">
    </div>
  </div>
</template>
<script>
import { getCurrentDate } from '../../assets/js/utilities';
export default {
  date(){
    return {
      hora2,
    }
  },
  props: ['value', 'documento', 'idVar', 'hora', 'tipo'],
  computed: {
    isEvaluated() {
      return !!parseInt(this.value);
    },
    horaComputed() {
      return this.hora2 ? this.hora2 : this.hora;
    }
  },
  methods: {
    async updateValue(e) {
      if (!e.target.value) {
        return;
      }
      const request = {
        documento: this.documento,
        idVar: this.idVar,
        valor_inicial: this.tipo === "inicial" ? e.target.value : 'valor_inicial',
        valor_final: this.tipo === "final" ? e.target.value : 'valor_final',
        tipo: this.tipo,
      }
      const response = await axios.post(`${env.EVAL_BITACORA_MERMA}?option=updateVariableBitacoraMerma`, request);
      const [evaluacion] = response.data.data;
      this.hora2 = evaluacion.hora_inicial ? evaluacion.hora_inicial : evaluacion.hora_final;
      this.$emit('input', e.target.value)
    },
    async removeEvaluation() {
      const request = {
        documento: this.documento,
        idVar: this.idVar,
        valor_inicial: this.tipo === "inicial" ? 0: 'valor_inicial',
        valor_final: this.tipo === "final" ? 0 : 'valor_final',
        tipo: this.tipo,
      }
      const response = await axios.post(`${env.EVAL_BITACORA_MERMA}?option=updateVariableBitacoraMerma`, request);
      const [evaluacion] = response.data.data;
      this.$emit('input', 0)
    }
  },
  filters: {
    hour: value => {
      if (!value) return ''
      const currentDate = getCurrentDate();
      const date = new Date(`${currentDate} ${value}`);
      return date.toLocaleString([], { hour12: true}).split(',')[1].trim();;
    }
  },
}
</script>
<style lang="scss">
  a {
    color: #303030 !important;
  }
  .text-muted{
    color: gray;
  }
</style>