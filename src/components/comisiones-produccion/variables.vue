<template>
  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Valor</th>
        <th>Guardar</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="variable in variables" :key="variable.id">
        <td>{{variable.maquina || ''}} {{variable.maquina && '-'}} {{variable.descripcion}}</td>
        <td>
          <input type="number" v-model="variable.valor" step="0.0001"/>
        </td>
        <td class="center">
          <button class="btn-floating" @click="updateVariable(variable.id)"><i class="material-icons">save</i></button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import porcentajeEficiencia from './porcentajeEficiencia.vue';
export default {
  data() {
    return {
      variables: [],
    }
  },
  props: ['fecha', 'suc'],
  async created() {
    const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=getVariables`, { suc: this.suc });
    this.variables = response.data;
    this.variables.forEach(v => v.valor = Number(Number(v.valor).toFixed(3)));
  },
  methods:{
    async updateVariable(id) {
      const variable = this.variables.find(v => v.id === id);
      if (variable.valor == '') {
        M.toast({
          html: "El valor es requerido.",
          classes: "red darken-1",
          outDuration: 2000,
        });
        return;
      }
      const response = await axios.post(`${env.EVAL_VARIABLE_COMISION_PROD}?option=updateVariableValue`, {...variable, fecha: this.fecha});
      const data = response.data;
      M.toast({
        html: "El valor fue actualizado correctamente.",
        classes: "green darken-1",
        outDuration: 2000,
      });
    }
  }
}
</script>