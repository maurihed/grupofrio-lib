<template>
  <div>
    <br>
    <progress-indicator :show="!isLoaded"></progress-indicator>
    <div v-if="isLoaded">
      <h5>Lista de vendedores</h5>
        <vendedor-card v-for="vendedor in vendedores" :key="vendedor.ExtEmpNo"
          :vendedor="vendedor"
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
      this.vendedores = response.data;
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