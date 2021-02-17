export class Marker {
  constructor(location, id, map, color, info = {}, markerClickHandler = () => {}, isBase = false) {
    this.id = id + 1;
    this.info = info;
    this.label = isBase ? 'B' : String(this.id);
    this.location = location;
    this.map = map;
    this.color = color
    this.highlightedColorStroke = "#2d3a8d";
    this.googleMarker = null;
    this.isSelected = false;
    this.isBase = isBase;

    this.markerClickHandler = markerClickHandler.bind(this);
    this.unselectMarker = this.unselectMarker.bind(this);
  }

  remove() {
    this.googleMarker.setMap(null);
  }
  render() {
    const label = {
      text: this.label,
      color: this.isBase ? 'white' : 'black',
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

    this.googleMarker.addListener("click", (a) => {
      if (this.isBase) {
        return;
      }
      this.isSelected = !this.isSelected;
      const icon = this.getMarkerIcon(this.isSelected ? this.highlightedColorStroke : null);
      this.googleMarker.setIcon(icon);
      this.markerClickHandler(this);
    });
    //  info window
    const infowindow = new window.google.maps.InfoWindow({
      content: `
        <h6 style="font-family: axiforma bold; color:#0b109f; font-size:18px;">${this.info.clave}</h6>
        <span>${this.info.name}</span> <br/>
        <small>${this.info.encargado}</small>
      `,
    });
    this.googleMarker.addListener('mouseover', function() {
      infowindow.open(this.map, this);
    });
    this.googleMarker.addListener('mouseout', function() {
      infowindow.close();
    });
  }

  unselectMarker() {
    this.isSelected = false;
    this.googleMarker.setIcon(this.getMarkerIcon());
  }

  getMarkerIcon(stroke = null, color = null) {
    const pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
    const labelOriginHole = new google.maps.Point(12,15);
    const pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
    const labelOriginFilled =  new google.maps.Point(12,9);
    const bgColor = this.isBase ? this.highlightedColorStroke : this.color; 

    const markerImage = {  // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
      path: pinSVGFilled,
      anchor: new google.maps.Point(12,17),
      fillOpacity: 1,
      fillColor: bgColor,
      strokeWeight: 2,
      strokeColor: stroke || bgColor,
      scale: 1.5,
      labelOrigin: labelOriginFilled
    };

    return markerImage;
  }
}