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
    directionService: null,
    directionsRenderer: null
  }),
  mounted() {
    this.directionService = new window.google.maps.DirectionsService();
    this.directionsRenderer = new window.google.maps.DirectionsRenderer();
    this.mapEl = this.$refs.map;
    this.map = new window.google.maps.Map(this.mapEl, {
      center: { lat: 19.8209996, lng: -101.0435721 },
      zoom: 15,
    });
    this.directionsRenderer.setMap(this.map);
    const route1 = [
      { lat: 19.8239402,lng: -101.0371753 },
      { lat: 19.821992, lng: -101.041432 },
      { lat: 19.825858, lng: -101.041089 },
      { lat: 19.828851, lng: -101.037869 },
    ];
    const route2 = [
      { lat: 19.8239402,lng: -101.0371753 },
      { lat: 19.816938, lng: -101.046309 },
      { lat: 19.816295, lng: -101.036288 },
      { lat: 19.821271, lng: -101.035344 },
    ];
    console.log(new Route('Ruta 1', '#00FF00', route2));
    this.drawRoute(route1);
    this.drawRoute(route2, '#00FF00');
  },
  methods: {
    newLatLng({ lat, lng }) {
      return new window.google.maps.LatLng(lat, lng);
    },
    newWaypoint(latLng, stop = true) {
      return {
        location: this.newLatLng(latLng),
        stopover: stop
      };
    },
    buildRequest(places) {
      return {
        origin: this.newLatLng(places.shift()),
        destination: this.newLatLng(places.pop()),
        waypoints: places.map((place) => this.newWaypoint(place)),
        optimizeWaypoints: true,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode.DRIVING,
      }
    },
    drawRoute(places, color) {
      const request = this.buildRequest(places);
      this.directionService.route(request, (response, status) => {
        console.log(response);
        if (status === "OK") {
          const { legs } = response.routes[0];
          const stops = legs.map(l => l.end_location);
          const { overview_path: route } = response.routes[0];
          stops.unshift(request.origin);
          this.displayRoute(route, stops, color);
        }
      });
    },
    displayRoute(route, stops, color = "#FE0156") {
      const flightPath = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: .6,
        strokeWeight: 6,
      });
      flightPath.setMap(this.map);
      stops.forEach(this.addMarker.bind(this));
    },
    addMarker(location, label) {
      new window.google.maps.Marker({
        position: location,
        animation: google.maps.Animation.DROP,
        label: String(label + 1),
        map: this.map,
      });
    }
  },
}
</script>

<style lang="scss" scoped>
  .map {
    width: 100%;
    height: 100%;
  }
</style>