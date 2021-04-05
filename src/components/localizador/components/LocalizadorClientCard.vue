<template>
  <div @click="openWindowsInfo" class="localizadorClientCard primary" :class="{'localizadorClientCard--active': isActive}">
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
  </div>
</template>

<script>
import ProductCardVue from './Product-card.vue';
import Vue from 'vue';

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
    },
    openWindowsInfo() {
      const ruta = this.$store.state.localizador.ruta;
      const { markers } = ruta;
      const marker = markers.find(m => m.cliente.clave == this.cliente.clienteId);
      const venta = this.cliente.Venta;
      if (!marker.infoWindow) {
        let productos = '';
        this.cliente.productos.forEach((producto) => {
          productos += `
          <div class="productCard">
            <div><span>Descripción: </span> <span class="text-bold">${producto.descripcion}</span></div>
            <div><span>Cantidad: </span> <span class="text-bold">${Vue.filter('number')(producto.cantidad)} pza</span></div>
            <div><span>Importe: </span> <span class="text-bold">${Vue.filter('money')(producto.importe)}</span></div>
            <div><span>Kilos: </span> <span class="text-bold">${Vue.filter('number')(producto.kilos)} Kg</span></div>
            <div><span>Hora: </span> <span class="text-bold">${Vue.filter('HLHour')(producto.hora)}</span></div>
          </div>`;
        }); 
        marker.setInfoWindow(new window.google.maps.InfoWindow({
          content: `
            <h6 style="font-family: axiforma bold; color:#0b109f; font-size:18px;">${this.cliente.clienteId}</h6>
            <span>${this.cliente.nombreTienda}</span> <br/>
            <span>Venta: </span><span class="text-bold primary">$ ${venta || 0}</span><br/>
            ${this.cliente.comentario ? `<span>Comentario:</span> <span>${this.cliente.comentario}</span>` : ''}
            <br>
            ${productos}
          `,
          })
        );
      }
      marker.toggleInfoWindow();
      this.isActive = !this.isActive;
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
    &--active {
      background: #dedede;
      .localizadorClientCard__popup {
        display: block;
      }
    }
  }
</style>
