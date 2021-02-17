<template>
  <div class="rutas-info-title" :class="{'hide': !isMenuOpen}">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'rutas-info-title',
  computed: {
    isMenuOpen() {
      return this.$store.state.isMenuOpen;
    }
  }
}
</script>