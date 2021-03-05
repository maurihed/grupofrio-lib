<template>
  <div>
    <div class="rutas-info-bar">
      <rutas-info-title>
        <h5>Rutas Clientes</h5>
      </rutas-info-title>
      <div class="d-flex rutas-info">
        <slot></slot>
      </div>
    </div>
    <div class="rutas-container">
      <rutas-menu :suc="suc"></rutas-menu>
      <div class="rutas-body">
        <div class="rutas-map">
          <v-map ></v-map>
        </div>
        <div class="map-footer">
          <map-footer :suc="suc"></map-footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RutasInfoTitleVue from './rutas-info-title.vue';

export default {
  name: 'default',
  props: ['suc'],
  components: {
    'rutas-info-title': RutasInfoTitleVue,
  },
}
</script>

<style lang="scss">
  .rutas-info {
    .input-field {
      width: 250px;
    }
    .select-dropdown.dropdown-trigger {
      margin: 0;
    }
  }
</style>
