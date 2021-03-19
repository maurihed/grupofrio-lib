<template>
  <div class="map" ref="map"></div>
</template>

<script>

export default {
  name: 'localizador-map',
  props:[],
  data: () => ({
    mapEl: null,
    map: null,
    directionsRenderer: null,
  }),
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.directionsRenderer = new window.google.maps.DirectionsRenderer();
      this.mapEl = this.$refs.map;
      this.map = new window.google.maps.Map(this.mapEl, {
        center: { lat: 23.720246, lng: -102.473178 },
        zoom: 6,
      });
      this.directionsRenderer.setMap(this.map);
      this.$store.dispatch('SET_MAP', this.map);
    }
  },
  computed: {
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
