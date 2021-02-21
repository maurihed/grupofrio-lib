<template>
<div class="day-item clickable" :class="{ 'checked': frecuencia.checked }" @click="toggleRoute()">
    <div @click.stop="" class="custom-color-input">
      <input :id="'color-'+frecuencia.name" type="color" @change="updateColor($event.target.value)">
      <label @click.stop="" :style="'background: '+color" :for="'color-'+frecuencia.name"></label>
    </div>
    <div class="day-info">
      <h6 class="primary text-bold">{{frecuencia.name}}</h6>
      <div>
        <small>Clientes: {{clients && clients.length - 1}}</small>
        <small>Capacidad: {{capacidad | number}} kg</small>
        <small>Distancia: {{kilometros | number}} km</small>
        <small>Tiempo: {{kilometros | number}} Hrs.</small>
      </div>
    </div>
    <div v-if="clients && clients.length > 1" @click.prevent.stop="" class="day-clients">
      <client-list :clients="clients" :color="color"></client-list>
    </div>
  </div>
</template>

<script>
import ClientListVue from '../components/client-list.vue';
  export default {
    name: "day-item",
    props: ['frecuencia'],
    data: () => ({
      checked: false,
    }),
    methods: {
      toggleRoute() {
        this.frecuencia.checked = !this.frecuencia.checked;
        if (this.frecuencia.checked) {
          this.$store.dispatch('SELECT_ROUTE', this.frecuencia.name);
        } else {
          this.$store.dispatch('UNSELECT_ROUTE', this.frecuencia.name);
        }
      },
      async updateColor(color) {
        this.frecuencia.color = color;
        await axios.post(`${env.RUTAS_FRECUENCIAS_API_URL}?option=updateColor`, { day: this.frecuencia.name, color });
      },
      getAvg(field) {
        const total = this.clients.reduce((total, client) => total + Number(client.info[field]), 0);
        return Math.round(total * 10) / 10;
      }
    },
    computed: {
      capacidad() {
        return this.frecuencia.capacidad;
        // this.clients && this.getAvg('capacidad') || 0;
      },
      kilometros() {
        return this.frecuencia.distancia;
        // return this.clients && this.getAvg('distancia') || 0;
      },
      tiempo() {
        return this.frecuencia.tiempo;
        // return Math.round(this.kilometros / 6) / 10;
      },
      clients() {
        return this.frecuencia.clients;
      },
      color() {
        return this.frecuencia.color;
      }
    },
    components: {
      'client-list': ClientListVue,
    }
  }
</script>

<style lang="scss" scoped>
  .day-item {
    padding: 0 !important;
    display: flex;
    position: relative;
    &.checked {
      background: #eaeaea;
    }
    .day-clients {
      position: absolute;
      left: 100%;
      height: 600px;
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
      & > .day-clients {
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
      height: 75px;
      width: 20px;
      left: 0;
      top: 0;
    }
  }
  .day-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 75px;
    margin-left: 1rem;
    h6 {
      font-weight: bold;
      margin: 0;
    }
  }
</style>