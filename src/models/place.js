export class Place {
  constructor({ info, lat, lng }, marker) {
    this.latlng = new window.google.maps.LatLng(lat, lng);
    this.info = info;
    this.lat = lat;
    this.lng = lng;
    this.waypoint = {
      location: this.latlng,
      stopover: true
    }
    this.marker = marker;
  }

  selectPlace() {
    this.isSelected = true;
  }

  getInfoPlace() {
    return 'info';
  }
}