export class SellerMarker {
  constructor({ latitud, longitud, isAwake }, map = null) {
    this.googleMarker = null;
    this.map = map;
    this.isAwake = isAwake;
    this.location = new window.google.maps.LatLng(latitud, longitud);
    // functions
    this.updatePosition = this.updatePosition.bind(this);
    this.setMap = this.setMap.bind(this);
    // init
    this.render();
  }

  setMap(map) {
    if (!this.map) {
      this.map = map;
    }
  };

  updatePosition({ latitud, longitud, isAwake }) {
    this.isAwake = isAwake;
    this.location = new window.google.maps.LatLng(latitud, longitud);
    this.googleMarker.setPosition(this.location);
    this.map.panTo(this.location);
    const label = {
      text: this.isAwake ? 'E' : 'A',
      color: '#fff',
    }
    const icon = this.getMarkerIcon();
    this.googleMarker.setIcon(icon);
    this.googleMarker.setLabel(label);
  }

  render() {
    const label = {
      text: this.isAwake ? 'E' : 'A',
      color: '#fff',
    }
    const icon = this.getMarkerIcon();

    this.googleMarker = new window.google.maps.Marker({
      icon,
      label,
      // icon: new google.maps.MarkerImage(`http://www.googlemapsmarkers.com/v1/${etiqueta}/${this.color}/${this.contorno}/${this.colorLetra}`),
      position: this.location,
      animation: window.google.maps.Animation.DROP,
      map: this.map,
    });
  }

  getMarkerIcon() {
    const pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
    const labelOriginFilled =  new google.maps.Point(12,9);
    const bgColor = this.isAwake ? '#00c853' : '#d50000';

    const markerImage = {  // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
      path: pinSVGFilled,
      anchor: new google.maps.Point(12,17),
      fillOpacity: 1,
      fillColor: bgColor,
      strokeWeight: 2,
      strokeColor: '#fff',
      scale: 1.5,
      labelOrigin: labelOriginFilled
    };

    return markerImage;
  }
}
