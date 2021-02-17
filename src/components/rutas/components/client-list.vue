<template>
  <div class="clients-list p-1">
    <client-item
      :key="'client-'+index"
      v-for="(client, index) in clients"
      :client="client"
      :color="color"
    ></client-item>
  </div>
</template>

<script>
import ClientItemVue from './client-item.vue';

export default {
  name: 'client-list',
  props: ['clients', 'color'],
  components: {
    'client-item': ClientItemVue,
  }
}
</script>