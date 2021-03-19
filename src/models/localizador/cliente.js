export class Cliente {
  constructor(cliente) {
    if (cliente.clave == 'OSO0000108') {
      console.log(cliente);
    }
    this.nombre = cliente.nombreTienda;
    this.clave = cliente.claveSAP;
    this.estado = Number(cliente.estado);
    this.venta = Number(cliente.venta);
    this.comentario =  cliente.comentario;
    this.latlng = new window.google.maps.LatLng(cliente.latitud, cliente.longitud);
    this.waypoint = {
      location: this.latlng,
      stopover: true
    }
    this.lat = cliente.latitud;
    this.lng = cliente.longitud;
  }
}