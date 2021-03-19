import { Marker } from "./marker";
import { Cliente } from "./cliente";

export class Route {
  constructor(clientes, map = null) {
    this.clientes = clientes.map(cliente => new Cliente(cliente));
    this.markers = [];
    this.isRendered = false;
    this.map = map;
    // services
    this.directionService = new window.google.maps.DirectionsService();
    this.flightPath = null;
    this.directionDataPromise = null;
    this.directionData = null;
    // functions
    this.loadDirectionData = this.loadDirectionData.bind(this);
    this.setMap = this.setMap.bind(this);
    this.remove = this.remove.bind(this);
    this.render = this.render.bind(this);
  }

  async render() {
    if (!this.clientes.length) {
      return;
    }
    this.directionData = await this.getDirectionData();
    const totalRoute = [];
    const totalStops = [];
    this.directionData.forEach((data, index) => {
      const [ directionRoute ] = data.routes;
      const { legs } = directionRoute;
      const stops = legs.map(l => l.end_location);
      if (index == 0 ) stops.unshift(this.clientes[0].latlng);
      if (index > 0) {
        stops.unshift(data.request.origin.location);
      }
      stops.pop();
      const { overview_path: route } = directionRoute;
      totalRoute.push(...route);
      totalStops.push(...stops);
    });
    this.displayRoute(totalRoute, totalStops);
    const [waypoint] = this.markers;
    if (waypoint) {
      this.map.setCenter(waypoint.cliente.latlng);
      this.map.setZoom(12);
    }
    this.isRendered = true;
  }
  
  async getDirectionData() {
    if (this.directionData) {
      return this.directionData;
    }
    return await this.directionDataPromise;
  }

  loadDirectionData() {
    this.directionDataPromise = this.getDirectionDataPromise();
  }

  getDirectionDataPromise() {
    if (!this.clientes.length) {
      return;
    }
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

  getRequests() {
    const places = [...this.clientes];
    const MAX_PLACES = 25;
    const nRequest = Math.ceil(places.length / (MAX_PLACES - 1));
    let requests = [...new Array(nRequest).keys()].map((_,index) => {
      return places.slice(
        (MAX_PLACES * index) - index,
        (MAX_PLACES * (index + 1)) - index);
    });
    requests[requests.length - 1].push(places[0]);
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

  displayRoute(route, stops) {
    this.flightPath = new google.maps.Polyline({
      path: route,
      geodesic: true,
      strokeColor: '#0d47a1',
      strokeOpacity: .6,
      strokeWeight: 6,
      geodesic: true,
    });
    // draw route 
    this.flightPath.setMap(this.map);
    // draw markers
    this.markers = stops.map((location, index) => {
      const cliente = this.getClient(location);
      return new Marker(index, this.map, cliente);
    });
    this.markers.forEach(cliente => cliente.render());
  }

  getClient(location) {
    const lat = location.lat(), lng = location.lng();
    const clients = this.clientes.map(client => ({...client, d: Math.abs(lat - client.lat) + Math.abs(lng - client.lng)}));
    const [ cliente ] = clients.sort((a, b) => a.d - b.d);
    return cliente || {};
  }

  setMap(map) {
    if(!this.map){
      this.map = map;
      this.markers.forEach(marker => marker.setMap(this.map));
    }
  }

  remove() {
    this.flightPath.setMap(null);
    this.flightPath = null;
    this.markers.forEach((marker) => {
      if (marker.remove) {
        marker.remove();
      }
    });
    this.isRendered = false;
  }
}