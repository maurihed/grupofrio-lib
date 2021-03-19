<template>
  <div class="map" ref="map"></div>
</template>

<script>
import { Route } from '../../models/route';

export default {
  name: 'v-map',
  props:[],
  data: () => ({
    mapEl: null,
    map: null,
    directionsRenderer: null,
    selectedPlaces: [],
  }),
  mounted() {
    this.initMap();
    // getRoutes
    // const route1 = [
    //   { lat: 19.8239402,lng: -101.0371753 },
    //   { lat: 19.821992, lng: -101.041432 },
    //   { lat: 19.825858, lng: -101.041089 },
    //   { lat: 19.828851, lng: -101.037869 },
    // ];
    // const route2 = [
    //   { lat: 19.8239402,lng: -101.0371753 },
    //   { lat: 19.816938, lng: -101.046309 },
    //   { lat: 19.816295, lng: -101.036288 },
    //   { lat: 19.821271, lng: -101.035344 },
    // ];

    // this.routes.push(new Route('Ruta Toluca', '#ffea00', amarilloTol, this.map, true));
    // this.routes.push(new Route('Ruta 2', '#00aaFF', route2, this.map, true));
    // this.routes.push(new Route('Ruta 1', '#ffaa00', route1, this.map, true));

    // this.routes.forEach(route => route.render());
    // this.$store.commit('setRoutes', this.routes);
  },
  methods: {
    initMap() {
      this.directionsRenderer = new window.google.maps.DirectionsRenderer();
      this.mapEl = this.$refs.map;
      this.map = new window.google.maps.Map(this.mapEl, {
        center: { lat: 23.720246, lng: -102.473178 },
        // center: { lat: 19.823944,lng: -101.037174 },
        zoom: 6,
      });
      this.directionsRenderer.setMap(this.map);
    },
    getSelectedPlaces() {
      console.log(
        this.routes.map(route => ({route: route.name, selectedPlaces: route.getSelectedPlaces()}))
      );
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
      if (oldRouteId.length === 0) {
        const [ routeId ] = newRouteIds;
        const route = this.$store.state.routes[routeId];
        const [ place ] = route.places;
        this.map.setCenter(place.latlng);
        this.map.setZoom(12);
      }
      const routeIds = newRouteIds.filter(route => !oldRouteId.includes(route));
      routeIds.forEach((routeId) => {
        const route = this.$store.state.routes[routeId];
        route.setMap(this.map);
        route.render();
      });
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
