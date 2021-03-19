<template>
  <div>
    <canastilla-tanque
      v-for="fila in Number(filas)"
      :key="fila"
      :fila="fila"
      :col="col"
      :descompuestas="descompuestas"
      :deshabilitadas="deshabilitadas"
      :selectable="selectable"
      :on-click="handleClick"
      :celdas="celdas"
      :descompuestos-clikable="descompuestosClikable"
    ></canastilla-tanque>
  </div>
</template>
<script>
import canastillaTanqueVue from './canastillaTanque.vue';

export default {
  props: ['filas', 'col', 'onClick', 'descompuestas', 'deshabilitadas', 'celdas', 'selectable', 'descompuestosClikable'],
  components: {
    'canastilla-tanque': canastillaTanqueVue,
  },
  methods: {
    handleClick(fila, col, id) {
      this.onClick(fila, col, id);
    }
  },
}
</script>