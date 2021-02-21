<template>
  <div class="map" ref="map"></div>
</template>

<script>

export default {
  name: 'frecuencias-map',
  props:[],
  data: () => ({
    mapEl: null,
    map: null,
    directionsRenderer: null,
    selectedPlaces: [],
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
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
    selectedRoutes() {
      return this.$store.state.selectedRoutes;
    }
  },
  watch: {
    selectedRoutes(newRouteIds, oldRouteId) {
      const [ routeId ] = newRouteIds;
      const route = this.$store.state.routes[routeId];
      if (route && route.clients.length) {
        console.log(route);
        const [ place ] = route.clients;
        this.map.setCenter(place.latlng);
        this.map.setZoom(12);
        const routeIds = newRouteIds.filter(route => !oldRouteId.includes(route));
        routeIds.forEach((routeId) => {
          const route = this.$store.state.routes[routeId];
          route.setMap(this.map);
          route.render();
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
