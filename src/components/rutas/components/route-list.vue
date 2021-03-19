<template>
  <div class="route-list">
    <div class="route-item">
      <route-item v-for="route in routes" :key="route.id" :route="route"></route-item>
    </div>
  </div>
</template>

<script>
import RouteItemVue from './route-item.vue';

export default {
  name: 'route-list',
  props: ['routes'],
  components: {
    'route-item': RouteItemVue,
  }
}
</script>
<style lang="scss" scoped>
  .route-list {
    position: relative;
  }
</style>