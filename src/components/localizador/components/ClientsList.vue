<template>
  <div class="clientsList">
    <localizador-clientCard v-for="cliente in clientes" :cliente="cliente" :key="cliente.clienteId"></localizador-clientCard>
  </div>
</template>
<script>
import LocalizadorClientCardVue from './LocalizadorClientCard.vue'
export default {
  name: 'ClientsList',
  props: {
    clientes: {
      type: Array
    }
  },
  components: {
    'localizador-clientCard': LocalizadorClientCardVue,
  } 
}
</script>
<style lang="scss" scoped>
  .clientsList {

  }
</style>