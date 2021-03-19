<template>
  <div @click="toggleProductos" class="localizadorClientCard primary" :class="{'localizadorClientCard--active': isActive}">
    <div class="localizadorClientCard__color" :class="{
      'localizadorClientCard__color--blue': cliente.estado == 1,
      'localizadorClientCard__color--red': cliente.estado == 0,
      'localizadorClientCard__color--yellow': cliente.estado == 2,
      'localizadorClientCard__color--purple': cliente.estado == 3,
    }"></div>
    <div class="localizadorClientCard__info text-truncate">
      <span class="m-0 text-bold primary text-truncate">{{cliente.nombreTienda}}</span>
      <div class="localizadorClientCard__details">
        <span>Venta: </span> <span class="text-bold">{{cliente.Venta | money}}</span>
        <span>Nivel: </span> <span>{{(cliente.nivelRefri || 0) | percentage}}</span> <br>
        <span v-if="cliente.comment">Comment: </span> <span v-if="cliente.comment" class="text-bold">"{{cliente.comment}}"</span>
      </div>
    </div>
    <div class="localizadorClientCard__popup">
      <product-card v-for="(producto, index) in cliente.productos" :key="index" :producto="producto"></product-card>
    </div>
  </div>
</template>

<script>
import ProductCardVue from './Product-card.vue';

export default {
  name:'LocalizadorClientCard',
  props: {
    cliente: {
      type: Object,
    }
  },
  data: () => ({
    isActive: false,
  }),
  methods: {
    toggleProductos() {
      if (this.cliente.productos.length) {
        this.isActive = !this.isActive;
      }
    }
  },
  components: {
    'product-card': ProductCardVue,
  },
}
</script>

<style lang="scss" scoped>
  .localizadorClientCard {
    display: flex;
    height: 65px;
    background: #eee;
    margin: 5px 0;
    width: 100%;
    cursor: pointer;
    &__color {
      display: block;
      width: 25px;
      flex-shrink: 0;
      &--red {
        background: #b71c1c;
      }
      &--blue {
        background: #2e3b8d;
      }
      &--yellow {
        background: #ffd600;
      }
      &--purple {
        background: #1073b6;
      }
    }
    &__info {
      padding: 0 10px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    &__details {
      font-size: 14px;
    }
    &__popup {
      display: none;
      position: absolute;
      min-height: 150px;
      max-height: 630px;
      overflow: auto;
      width: 350px;
      top: 150px;
      left: 400px;
      z-index: 1;
      background: #dedede;
      box-shadow: 0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%);
      padding: 1rem;
    }
    &--active {
      background: #dedede;
      .localizadorClientCard__popup {
        display: block;
      }
    }
  }
</style>
