<template>
  <div class="route-item clickable" :class="{ 'checked': route.checked }" @click="toggleRoute()">
    <div v-if="!!route.id" @click.stop="" class="custom-color-input">
      <input :id="'color-'+route.id" type="color" @change="updateColor(route, $event.target.value)">
      <label @click.stop="" :style="'background: '+route.color" :for="'color-'+route.id"></label>
    </div>
    <div class="route-info">
      <h6>{{route.name}}</h6>
      <div>
        <small>Clientes: {{route.clients.length}}</small>
        <small>Capacidad: {{Math.round(route.capacidad * 10) / 10 | number}} kg</small>
        <small>Distancia: {{Math.round(route.distancia * 10) / 10 | number}} km</small>
      </div>
    </div>
    <div @click.prevent.stop="" class="route-clients">
      <client-list :clients="route.clients" :color="route.color"></client-list>
    </div>
  </div>
</template>

<script>
import ClientListVue from './client-list.vue'
export default {
  name: 'route-item',
  props: ['route'],
  components: {
    'client-list': ClientListVue,
  },
  methods: {
    async updateColor(route, color) {
      route.color = color;
      const response = await axios.post(`${env.RUTAS_API_URL}?option=updateColor`,{ routeId: route.id, color });
    },
    toggleRoute() {
      this.route.checked = !this.route.checked;
      if (this.route.checked) {
        this.$store.dispatch('SELECT_ROUTE', this.route.id);
      } else {
        this.$store.dispatch('UNSELECT_ROUTE', this.route.id);
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .route-item {
    color: #2d3a8d;
    font-family: 'axiforma', sans-serif;
    padding: 0 !important;
    display: flex;
    &.checked {
      background: #eaeaea;
    }
    .route-clients {
      position: absolute;
      left: 100%;
      height: 510px;
      width: 400px;
      z-index: 1;
      top: 0;
      background: #eaeaea;
      display: none;
      box-shadow: 2px 2px 3px #b9b9b9;
      transition: 1s;
      overflow: auto;
    }
    &:hover {
      background: #eaeaea;
      & > .route-clients {
        display: block;
      }
    }
  }
  .custom-color-input {
    display: contents;
    input {
      display: none;
    }
    label {
      display: inline-block;
      height: 50px;
      width: 20px;
      left: 0;
      top: 0;
    }
  }
  .route-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 50px;
    margin-left: 1rem;
    h6 {
      font-weight: bold;
      margin: 0;
    }
  }
</style>