<template>
  <div class="vendedor-card">
    <span class="vendedor-card-nombre">{{vendedor.NOMBRE}}</span>
    <div class="input-field">
      <input id="sueldo_base" v-model="sueldo_base" type="number" class="validate">
      <label for="sueldo_base">Sueldo base</label>
    </div>
    <div class="input-field">
      <input id="comision" v-model="comision" type="number" min="0.000" max="1" step="0.001" class="validate">
      <label for="comision">Comision</label>
    </div>
    <button class="btn-floating" @click="guardar"><i class="material-icons">save</i></button>
  </div>
</template>

<script>
export default {
  name:'vendedor-card',
  props:['vendedor', 'action'],
  data: ()=>({
    sueldo_base: 0,
    comision: 0,
  }),
  created() {
    this.sueldo_base = Math.round(Number(this.vendedor.variables.sueldo_base));
    this.comision = Math.round(Number(this.vendedor.variables.comision)*1000)/1000;
  },
  mounted() {
    M.updateTextFields();
  },
  methods: {
    guardar() {
      const data = {
        id: this.vendedor.variables.id,
        sueldo_base: this.sueldo_base,
        comision: this.comision,
        vendedor: this.vendedor,
      };
      this.action(data);
    }
  }
}
</script>

<style lang="scss" scoped>
  .vendedor-card {
    display: flex;
    border: 2px solid #2e3b8d;
    justify-content: space-around;
    align-items: center;
    border-radius: 5px;
    margin-bottom: 1rem;
    .vendedor-card-nombre {
      width: 30%;
    }
    .input-field input {
      width: 300px;
    }
  }
</style>