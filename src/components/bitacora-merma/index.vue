<template>
  <div>
    <ul class="collapsible" data-collapsible="accordion" >
      <li v-for="(tipo, name) in tipos" :key="name">
        <div class="collapsible-header"><i class="material-icons">radio_button_checked</i>{{name}}</div>
        <div class="collapsible-body" style="overflow-x:auto;">
          <table class="table">
            <thead>
              <tr>
                <th>Metrica</th>
                <th>Inicial</th>
                <th>Final</th>
                <th>Consumo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="variable in tipo" :key="variable.variable_id">
                <td class="center">{{variable.descripcion}}</td>
                <td class="center">
                  <merma-input
                    v-model="variable.valor_inicial"
                    :documento="documento"
                    :idVar="variable.variable_id"
                    :hora="variable.hora_inicial"
                    tipo="inicial"
                  >
                  </merma-input>
                </td>
                <td class="center">
                  <merma-input
                    v-if="!tipoBloqueados.includes(variable.descripcion)"
                    v-model="variable.valor_final"
                    :documento="documento"
                    :idVar="variable.variable_id"
                    :hora="variable.hora_final"
                    tipo="final"
                  >
                  </merma-input>
                </td>
                <td class="center">
                  <span>{{getConsumo(variable.valor_inicial, variable.valor_final, variable.multiplicador) | number}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['documento'],
  data() {
    return {
      tipos: [],
      tipoBloqueados:['Carro Tanque','Compresor 1','Compresor 2','Compresor 3','Compresor 4','Compresor 5','Compresor 6','Grados Baume'],
    }
  },
  async created() {
    const response = await axios.post(`${env.EVAL_BITACORA_MERMA}?option=getVariables`,{ documento: this.documento });
    this.tipos = response.data;
  },
  mounted() {
    M.Collapsible.init(document.querySelectorAll('.collapsible'));
  },
  methods: {
    getConsumo(inicial, final, multiplicador = 1) {
      if (parseInt(inicial) && parseInt(final)) {
        return (final - inicial) * multiplicador;
      }
      if (parseInt(inicial)) {
        return inicial * multiplicador;
      }
      return 0;
    }
  },
  filters: {
    number(value) {
      if (!value) return 0;
      return new Intl.NumberFormat("en-IN").format(value);
    }
  },
}
</script>

<style lang="scss">

</style>