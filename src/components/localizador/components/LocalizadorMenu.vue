<template>
  <div class="rutas-menu">
    <clients-list :clientes="clientes"></clients-list>
  </div>
</template>
<script>
import ClientsListVue from './ClientsList.vue';
  export default {
    name: 'localizador-menu',
    props: ['suc'],
    data: () => ({
    }),
    computed: {
      clientes() {
        return this.$store.state.localizador.clientes;
      }
    },
    components: {
      'clients-list': ClientsListVue,
    },
  }
</script>
<style lang="scss" scoped>

</style>

<style lang="scss">
  .rutas-menu {
    display: block;
  }
</style>