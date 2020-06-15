<template>
  <div>
    <a class="btn-link" :class="{disabled:isDisabled}" @click="removeEvaluation" v-if="wasChecked">{{evaluacion.hora | hour}}</a>
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
      type: Array,
    },
    day: {
      type: Number,
    },
  },
  created() {
    const d = new Date();
    this.currentDate = `${d.getFullYear()}-${(d.getMonth()+'').padStart(2, 0)}-${(d.getDate()+'').padStart(2, 0)}`;
  },
  filters: {
    hour: value => {
      const d = new Date();
      const currentDate = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!value) return ''
      const date = new Date(`${currentDate} ${value}`);
      return date.toLocaleString([], { hour12: true}).split(',')[1].trim();;
    }
  },
  computed:{
    date() {
      return this.currentDate.slice(0,-2)+(this.day + "").padStart(2, 0);
    },
    isDisabled() {
      return this.date !== this.currentDate;
    },
    evaluacion() {
      let evaluacion = this.evaluaciones.filter(e => e.fecha === this.date);
      evaluacion = evaluacion.length ? evaluacion[0] : {};
      return evaluacion;
    },
    wasChecked() {
      return !!this.evaluacion.evaluacion;
    }
  },
  methods: {
    updateValue(isChecked) {
      console.log('updating...', this.evaluacion, this.date, isChecked)
    },
    removeEvaluation() {
      console.log('removing...');
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