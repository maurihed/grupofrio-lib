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
    ></canastilla-tanque>
  </div>
</template>
<script>
import canastillaTanqueVue from './canastillaTanque.vue';

export default {
  props: ['filas', 'col', 'onClick', 'descompuestas', 'deshabilitadas', 'celdas', 'selectable'],
  components: {
    'canastilla-tanque': canastillaTanqueVue,
  },
  methods: {
    handleClick(fila, col) {
      this.onClick(fila, col);
    }
  },
}
</script>