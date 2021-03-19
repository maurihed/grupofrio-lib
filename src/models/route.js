import { Marker } from "./marker";
import { Place } from "./place";

export class Route {
  constructor(route, map = null, markerClickHandler) {
    this.map = map;
    this.id = route.id;
    this.name = route.name;
    this.color = route.color;
    this.checked = route.checked;
    this.clients = route.clients;
    this.places = this.clients.map(p => new Place(p));
    this.flightPath = null;
    this.isRendered = false;
    this.markerClickHandler = markerClickHandler;
    // services
    this.directionService = new window.google.maps.DirectionsService();
    this.directionDataPromise = null;
    this.directionData = null;
    // info ruta
    this.tiempo = 0;
    this.gasolina = 0;
    this.distancia = this.clients.reduce((total, client) => total += Number(client.info.distancia), 0);
    this.capacidad = this.clients.reduce((total, client) => total += Number(client.info.capacidad), 0);
    // functions
    this.getSelectedPlaces = this.getSelectedPlaces.bind(this);
    this.loadDirectionData = this.loadDirectionData.bind(this);
  }

  async render() {
    if (this.id === 0 ) {
      this.displayMarkers();
      this.isRendered = true;
      return;
    }
    this.directionData = await this.getDirectionData();
    const totalRoute = [];
    const totalStops = [];
    this.directionData.forEach((data, index) => {
      const [ directionRoute ] = data.routes;
      const { legs } = directionRoute;
      const stops = legs.map(l => l.end_location);
      if (index == 0 ) stops.unshift(this.places[0].latlng);
      if (index > 0) {
        stops.unshift(data.request.origin.location);
      }
      stops.pop();
      const { overview_path: route } = directionRoute;
      totalRoute.push(...route);
      totalStops.push(...stops);
    });
    this.displayRoute(totalRoute, totalStops);
    this.isRendered = true;
  }

  loadDirectionData() {
    this.directionDataPromise = this.getDirectionDataPromise();
  }

  getDirectionDataPromise() {
    this.directionData = null;
    let requests = this.getRequests();
    requests = requests.map((request) => new Promise((resolve, reject) => {
      this.directionService.route(request, (response, status) => {
        if (status === "OK") {
          resolve((response));
        } else {
          reject(status);
        }
      });
    }));
    return Promise.all(requests);
  }

  async getDirectionData() {
    if (this.directionData) {
      return this.directionData;
    }
    return await this.directionDataPromise;
  }

  displayRoute(route, stops) {
    this.flightPath = new google.maps.Polyline({
      path: route,
      geodesic: true,
      strokeColor: this.color,
      strokeOpacity: .6,
      strokeWeight: 6,
    });
    // draw route 
    this.flightPath.setMap(this.map);
    // draw markers
    this.places = stops.map((location, index) => {
      const info = this.getPlaceInfo(location);
      return new Place(
        { info, lat: location.lat(), lng: location.lng() },
        new Marker(location, index, this.map, this.color, info, this.markerClickHandler, index === 0)
      )
    });
    this.places.forEach(place => place.marker.render());
    this.setInfoRoute();
  }

  displayMarkers() {
    this.places = this.places.map((place, index) => {
      return new Place(
        { info: place.info, lat: place.lat, lng: place.lng },
        new Marker(place.latlng, index, this.map, this.color, place.info, this.markerClickHandler)
      )
    });
    this.places.forEach(place => place.marker.render());
  }

  getPlaceInfo(location) {
    const lat = location.lat(), lng = location.lng();
    const clients = this.clients.map(client => ({...client, d: Math.abs(lat - client.lat) + Math.abs(lng - client.lng)}));
    const place = clients.sort((a, b) => a.d - b.d);
    return place[0] && place[0].info || {};
  }

  getRequests() {
    const places = [...this.places];
    const MAX_PLACES = 25;
    const nRequest = Math.ceil(places.length / (MAX_PLACES - 1));
    let requests = [...new Array(nRequest).keys()].map((_,index) => {
      return places.slice(
        (MAX_PLACES * index) - index,
        (MAX_PLACES * (index + 1)) - index);
    });
    requests[requests.length - 1].push(places[0]);
    // requests.forEach(request => {
    //   console.log(request.map(p => p.info.name));
    // });
    return requests.map((request) => this.getRequest(request));
  }
  getRequest(places) {
    const origin = places.shift().latlng;
    const destination = places.pop().latlng;
    return {
      origin,
      destination,
      waypoints: places.map((place) => place.waypoint),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  }

  setInfoRoute() {
    this.directionData.forEach((data) => {
      const { routes: [ { legs } ] } = data;
      const tiempo = legs.reduce((total, l) => l.duration.value + total, 0);
      const distancia = legs.reduce((total, l) => l.distance.value + total, 0);
      this.tiempo += Number(tiempo);
      this.distancia += distancia;
      this.gasolina += Math.ceil(distancia / 10 / 6) / 100;
    });
    this.distancia /= 1000;
  }

  getSelectedPlaces() {
    return this.places.filter((place) => place.marker && place.marker.isSelected);
  }

  remove() {
    if (this.id !== 0 ) {
      this.flightPath.setMap(null);
      this.flightPath = null;
    }
    this.places.forEach((place) => {
      if(place.marker) place.marker.remove();
      place.marker = null;
    });
    this.isRendered = false;
  }

  setMap(map) {
    if(!this.map){
      this.map = map;
    }
  }

  changeColor(color) {
    this.flightPath.setOptions({ strokeColor: `#${color}` });
    this.places.forEach((place) => {
      if (place.marker) {
        const icon = place.marker.googleMarker.getMarkerIcon(color);
        place.marker.googleMarker.setIcon(icon);
      }
    });
  }
}