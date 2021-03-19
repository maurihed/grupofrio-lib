export class Marker {
  constructor(location, id, map, color, info = {}, isBase = false, onChangeHandler = () => {}) {
    this.id = id;
    this.info = info;
    this.label = isBase ? 'B' : String(this.id);
    this.location = location;
    this.map = map;
    this.color = color
    this.googleMarker = null;
    this.isBase = isBase;
    this.onChangeHandler = onChangeHandler;
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
    const markerCtx = this;
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <h6 style="font-family: axiforma bold; color:#0b109f; font-size:18px;">${this.info.clave}</h6>
        <h6>Selecciona los dias de visita</h6>
        <div style="display: flex; justify-content: space-around;">
          <div style="display: flex; flex-direction:column; align-items:center; justify-content: center;">
            <span>L</span>
            <p class="m-0">
              <label>
                <input value="lunes" class="filled-in" type="checkbox" ${this.info.frecuencias.lunes === '1' && 'checked'} />
                <span style="padding-left: 16px;"></span>
              </label>
            </p>
          </div>
          <div style="display: flex; flex-direction:column; align-items:center; justify-content: center;">
            <span>M</span>
            <p class="m-0">
              <label>
                <input value="martes" class="filled-in" type="checkbox" ${this.info.frecuencias.martes === '1' && 'checked'} />
                <span style="padding-left: 16px;"></span>
              </label>
            </p>
          </div>
          <div style="display: flex; flex-direction:column; align-items:center; justify-content: center;">
            <span>M</span>
            <p class="m-0">
              <label>
                <input value="miercoles" class="filled-in" type="checkbox" ${this.info.frecuencias.miercoles === '1' && 'checked'} />
                <span style="padding-left: 16px;"></span>
              </label>
            </p>
          </div>
          <div style="display: flex; flex-direction:column; align-items:center; justify-content: center;">
            <span>J</span>
            <p class="m-0">
              <label>
                <input value="jueves" class="filled-in" type="checkbox" ${this.info.frecuencias.jueves === '1' && 'checked'} />
                <span style="padding-left: 16px;"></span>
              </label>
            </p>
          </div>
          <div style="display: flex; flex-direction:column; align-items:center; justify-content: center;">
            <span>V</span>
            <p class="m-0">
              <label>
                <input value="viernes" class="filled-in" type="checkbox" ${this.info.frecuencias.viernes === '1' && 'checked'} />
                <span style="padding-left: 16px;"></span>
              </label>
            </p>
          </div>
          <div style="display: flex; flex-direction:column; align-items:center; justify-content: center;">
            <span>S</span>
            <p class="m-0">
              <label>
                <input value="sabado" class="filled-in" type="checkbox" ${this.info.frecuencias.sabado === '1' && 'checked'} />
                <span style="padding-left: 16px;"></span>
              </label>
            </p>
          </div>
          <div style="display: flex; flex-direction:column; align-items:center; justify-content: center;">
            <span>D</span>
            <p class="m-0">
              <label>
                <input value="domingo" class="filled-in" type="checkbox" ${this.info.frecuencias.domingo === '1' && 'checked'} />
                <span style="padding-left: 16px;"></span>
              </label>
            </p>
          </div>
        </div>
      `,
    });
    google.maps.event.addListener(infoWindow, 'domready', () => {
      const checkboxes = document.querySelectorAll('input.filled-in');
      checkboxes.forEach((checkbox) => checkbox.addEventListener('change', function(e) {
        const el = e.target;
        markerCtx.onChangeHandler(markerCtx, el.value, el.checked);
      }));
    });
    this.googleMarker.addListener("click", function() {
      if (markerCtx.isBase) {
        return;
      }
      markerCtx.isSelected = !markerCtx.isSelected;
      console.log(markerCtx.info);
      if (markerCtx.isSelected) {
        infoWindow.open(this.map, this);
      } else {
        infoWindow.close();
      }
    });

    // this.googleMarker.addListener('mouseover', function() {
    //   infowindow.open(this.map, this);
    // });
    // this.googleMarker.addListener('mouseout', function() {
    //   infowindow.close();
    // });
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