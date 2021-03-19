<template>
  <div>
    <br>
    <progress-indicator :show="!isLoaded"></progress-indicator>
    <div v-if="isLoaded">
        <h5 class="center text-primary">Vendedores</h5>
        <vendedor-card v-for="vendedor in vendedores" :key="vendedor.ExtEmpNo"
          :vendedor="vendedor"
          :action="actualizarVariable"
          >
        </vendedor-card>
        <h5 class="center text-primary">Supervisores</h5>
        <vendedor-card v-for="supervisor in supervisores" :key="supervisor.ExtEmpNo"
          :vendedor="supervisor"
          :action="actualizarVariable"
          >
        </vendedor-card>
        <h5 class="center text-primary">Gerentes</h5>
        <vendedor-card v-for="gerente in gerentes" :key="gerente.ExtEmpNo"
          :vendedor="gerente"
          :action="actualizarVariable"
          >
        </vendedor-card>
    </div>
  </div>
</template>

<script>
import { displayError, displayMessage } from '../../../assets/js/utilities';
import VendedorCard from './vendedor-card.vue';
export default {
  props: ['suc'],
  data: () => ({
    isLoaded: false,
    vendedores: [],
    supervisores: [],
    gerentes: [],
  }),
  async created() {
    await Promise.allSettled([
      this.fetchVendedores(),
    ]);
    this.isLoaded = true;
  },
  methods: {
    async fetchVendedores() {
      const response = await axios.post(`${env.CONFIGURACION_VARIABLES_VENDEDORES}?option=getVendedores`, { suc: this.suc });
      const { vendedores, gerentes, supervisores } = response.data;
      this.vendedores = vendedores;
      this.gerentes = gerentes;
      this.supervisores = supervisores;
    },
    async actualizarVariable(data) {
      const response = await axios.post(`${env.CONFIGURACION_VARIABLES_VENDEDORES}?option=actualizar`, data);
      const { error } = response.data;
      if (error) {
        displayError("No se pudo guardar, intente nuevamente mas tarde.");
      } else { 
        displayMessage("Datos guardados correctamente.");
      }
      console.log(response.data);
    }
  },
  components: {
    'vendedor-card': VendedorCard,
  }
}
</script>