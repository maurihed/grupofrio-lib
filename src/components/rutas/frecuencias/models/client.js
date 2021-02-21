export class Client {
  constructor(client, marker = null) {
    this.latlng = new window.google.maps.LatLng(client.lat, client.lng);
    this.info = client.info;
    this.lat = client.lat;
    this.lng = client.lng;
    this.waypoint = {
      location: this.latlng,
      stopover: true
    }
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  selectPlace() {
    this.isSelected = true;
  }

  getInfoPlace() {
    return 'info';
  }
}