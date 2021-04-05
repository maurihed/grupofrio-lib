export class Marker {
  constructor(index, map, cliente) {
    if (cliente.clave == 'OSO0000108') {
      console.log(cliente);
    }
    this.index = index + 1;
    this.map = map;
    this.cliente = cliente;
    this.isRendered = false;
    this.googleMarker = null;
    this.isInfoOpen = false;
    this.infowindow = null;
    this.estados = [
      '#b71c1c', // 0 sin accion
      '#2e3b8d', // 1 venta
      '#ffd600', // 2 no venta
      '#1073b6', // 3 especial
    ]

    this.render = this.render.bind(this);
    this.remove = this.remove.bind(this);
    this.setMap = this.setMap.bind(this);
    this.toggleInfoWindow = this.toggleInfoWindow.bind(this);
    this.setInfoWindow = this.setInfoWindow.bind(this);
  }

  setInfoWindow(infoWindow) {
    this.infoWindow = infoWindow;
  }

  render() {
    const label = {
      text: String(this.index),
      color: '#fff',
    }
    const icon = this.getMarkerIcon();

    this.googleMarker = new window.google.maps.Marker({
      icon,
      label,
      // icon: new google.maps.MarkerImage(`http://www.googlemapsmarkers.com/v1/${etiqueta}/${this.color}/${this.contorno}/${this.colorLetra}`),
      position: this.cliente.latlng,
      animation: window.google.maps.Animation.DROP,
      map: this.map,
    });

    //  info window
    /**
    * nombre
      clave
      estado
      venta
      comentario
          */
    const infowindow = new window.google.maps.InfoWindow({
      content: `
        <h6 style="font-family: axiforma bold; color:#0b109f; font-size:18px;">${this.cliente.clave}</h6>
        <span>${this.cliente.nombre}</span> <br/>
        <span>Venta: </span><span class="text-bold primary">$ ${this.cliente.venta}</span><br/>
        ${this.cliente.comentario ? `<span>Comentario:</span> <span>${this.cliente.comentario}</span>` : ''}
      `,
    });
    this.googleMarker.addListener('click', function() {
      if (this.isInfoOpen) {
        infowindow.close();
      } else {
        infowindow.open(this.map, this);
      }
      this.isInfoOpen = !this.isInfoOpen;
    });
  }

  remove() {
    if (this.googleMarker) {
      this.googleMarker.setMap(null);
    }
  }

  toggleInfoWindow() {
    if (this.isInfoOpen) {
      this.infoWindow.close();
    } else {
      this.infoWindow.open(this.map, this.googleMarker);
    }
    this.isInfoOpen = !this.isInfoOpen;
  }

  getMarkerIcon(stroke = "#fff") {
    const pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
    const labelOriginHole = new google.maps.Point(12,15);
    const pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
    const labelOriginFilled = new google.maps.Point(12,9);

    const markerImage = {  // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
      path: pinSVGFilled,
      anchor: new google.maps.Point(12,17),
      fillOpacity: 1,
      fillColor: this.estados[this.cliente.estado] || '#eee',
      strokeWeight: 2,
      strokeColor: stroke,
      scale: 1.5,
      labelOrigin: labelOriginFilled
    };

    return markerImage;
  }

  setMap(map) {
    this.map = map;
  }
}