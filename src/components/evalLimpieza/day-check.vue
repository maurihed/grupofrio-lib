<template>
  <div>
    <a class="btn-link" :class="{disabled:isDisabled}" @click="removeEvaluation" v-if="wasChecked">{{evaluacion.hora | hour}}</a>
    <div v-if="!isDisabled && wasChecked">
      <span>¿Se solucionó?</span>
      <div class="switch">
        <label>
          No
          <input type="checkbox" @change="updateSolucion($event.target.checked)" :checked="(!!evaluacion.se_soluciono)" :disabled="isDisabled">
          <span class="lever"></span>
          Si
        </label>
      </div>
    </div>
    <div v-if="isDisabled && evaluacion.hora">{{!!evaluacion.se_soluciono ? '' : 'No'}} solucionado</div>
    <p v-if="!wasChecked">
      <label>
        <input
          :disabled="isDisabled"
          type="checkbox"
          class="filled-in"
          @change="updateValue($event.target.checked)"
        />
        <span></span>
      </label>
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentDate: null,
    }
  },
  props: {
    evaluaciones: {
      type: Array | Object,
    },
    day: {
      type: Number,
    },
    daySelected: {
      type: String,
    },
    maquina: {
      type: Number,
    },
    aspectoId: {
      type: Number,
    },
    empleado: {
      type: String,
    }
  },
  filters: {
    hour: value => {
      const d = new Date();
      const currentDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      if (!value) return ''
      const date = new Date(`${currentDate} ${value}`);
      return date.toLocaleString([], { hour12: true}).split(',')[1].trim();;
    }
  },
  created() {
    const d = new Date();
    this.currentDate = `${d.getFullYear()}-${(d.getMonth()+1+'').padStart(2, 0)}-${(d.getDate()+'').padStart(2, 0)}`;
  },
  computed:{
    date() {
      return this.daySelected.slice(0,-2)+(this.day + "").padStart(2, 0);
    },
    isDisabled() {
      return this.date !== this.currentDate;
    },
    evaluacion:{
      get() {
        if (!this.evaluaciones.length) {
          return {};
        }
        let evaluacion = this.evaluaciones.filter(e => e.fecha === this.date);
        evaluacion = evaluacion.length ? evaluacion[0] : {};
        return evaluacion;
      },
      set(value) {
        if (Object.keys(this.evaluacion).length) {
          // existe
          this.evaluaciones[0].evaluacion = value.evaluacion;
          this.evaluaciones[0].hora = value.hora;
        }
        else {
          // no existe
          this.evaluaciones.push(value);
        }
      }
    },
    wasChecked() {
      return this.evaluacion.evaluacion === '1';
    }
  },
  methods: {
    updateValue(isChecked) {
      // $maquina, $id, $date, $empleado, $aspecto, $eval
      const request = {
        maquina: this.maquina, 
        id: this.evaluacion.eval_id || null, 
        date: this.date, 
        empleado: this.empleado, 
        aspecto: this.aspectoId, 
        eval: isChecked ? 1 : 0,
      };
      axios.post(`${env.ASPECTOS_EVAL_LIMPIEZA_URL}?option=updateEvaluacion`, request).then(response => {
        const [val] = response.data;
        this.evaluacion = val;
      });
    },
    removeEvaluation() {
      const request = {
        maquina: this.maquina, 
        id: this.evaluacion.eval_id || null, 
        date: this.date, 
        empleado: this.empleado, 
        aspecto: this.aspectoId, 
        eval: 0,
      };
      axios.post(`${env.ASPECTOS_EVAL_LIMPIEZA_URL}?option=updateEvaluacion`, request).then(response => {
        this.evaluacion.evaluacion = '0';
      });
    },
    updateSolucion(isSolved) {
      const request = {
        id: this.evaluacion.eval_id,
        isSolved: !!isSolved,
      };
      axios.post(`${env.ASPECTOS_EVAL_LIMPIEZA_URL}?option=updateSolucionLimpieza`, request).then(response => {
        console.log(response);
      });
    }
  }
}
</script>

<style lang="scss">
  .btn-link {
      color: #2e3b8d;
      cursor: pointer;
  }
  .disabled {
    color: gray;
    opacity: 0.8;
    cursor: default !important;
    pointer-events: none;
  }
</style>