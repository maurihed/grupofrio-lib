import { Client } from './client';
import { Marker } from './marker';

export class FrecuenciaDay {
  constructor(day, changeHandler) {
    this.name = day.name;
    this.color = day.color;
    this.clients = day.clients.map(client => new Client(client));
    this.checked = false;
    this.map = null;
    this.changeHandler = changeHandler;
    // services
    this.directionService = new window.google.maps.DirectionsService();
    this.directionDataPromise = null;
    this.directionData = null;
    // info ruta
    this.distancia = this.clients.reduce((total, client) => total += Number(client.info.distancia), 0);
    this.capacidad = this.clients.reduce((total, client) => total += Number(client.info.capacidad), 0);
    this.tiempo = Math.round(this.distancia / 60 * 10) / 10;
    this.gasolina = 0;

    this.loadDirectionData = this.loadDirectionData.bind(this);
  }

  setMap(map) {
    if(!this.map){
      this.map = map;
    }
  }

  getRequests() {
    const clients = [...this.clients];
    const MAX_CLIENTS = 25;
    const nRequest = Math.ceil(clients.length / (MAX_CLIENTS - 1));
    let requests = [...new Array(nRequest).keys()].map((_,index) => {
      return clients.slice(
        (MAX_CLIENTS * index) - index,
        (MAX_CLIENTS * (index + 1)) - index);
    });
    console.log(requests);
    requests[requests.length - 1].push(clients[0]);
    // requests.forEach(request => {
    //   console.log(request.map(p => p.info.name));
    // });
    return requests.map((request) => this.getRequest(request));
  }
  getRequest(clients) {
    const origin = clients.shift().latlng;
    const destination = clients.pop().latlng;
    return {
      origin,
      destination,
      waypoints: clients.map((place) => place.waypoint),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  }

  loadDirectionData() {
    if (!this.clients.length) return;
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
    this.clients = stops.map((location, index) => {
      const info = this.getPlaceInfo(location);
      const marker = new Marker(location, index, this.map, this.color, info, index === 0, this.changeHandler);
      return new Client({ info, lat: location.lat(), lng: location.lng() }, marker)
    });
    this.clients.forEach(client => client.marker.render());
    this.setInfoRoute();
  }

  getPlaceInfo(location) {
    const lat = location.lat(), lng = location.lng();
    const clients = this.clients.map(client => ({...client, d: Math.abs(lat - client.lat) + Math.abs(lng - client.lng)}));
    const place = clients.sort((a, b) => a.d - b.d);
    return place[0] && place[0].info || {};
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

  async render() {
    this.directionData = await this.getDirectionData();
    const totalRoute = [];
    const totalStops = [];
    this.directionData.forEach((data, index) => {
      const [ directionRoute ] = data.routes;
      const { legs } = directionRoute;
      const stops = legs.map(l => l.end_location);
      if (index == 0 ) stops.unshift(this.clients[0].latlng);
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

  remove() {
    if (this.flightPath ) {
      this.flightPath.setMap(null);
      this.flightPath = null;
    }
    this.clients.forEach((client) => {
      if(client.marker) client.marker.remove();
      client.marker = null;
    });
    this.isRendered = false;
  }
}