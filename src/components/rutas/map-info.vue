<template>
  <div class="contents">
    <div class="main-footer d-flex">
      <div class="footer-item info-field">Información de la ruta</div>
      <div class="footer-item d-flex flex-column b-l">
        <div class="d-flex justify-content-between px-1">
          <span class="hl-thin">tiempo</span>
          <span class="hl-bold">{{tiempo | tiempo}}</span>
        </div>
        <div class="d-flex justify-content-between px-1">
          <span class="hl-thin">distancia</span>
        <span class="hl-bold">{{distancia | km}}</span>
        </div>
      </div>
      <div class="footer-item d-flex flex-column b-rl">
        <div class="d-flex justify-content-between px-1">
          <span class="hl-thin">gasolina</span>
          <span class="hl-bold">{{gasolina | gasolina}}</span>
        </div>
        <div class="d-flex justify-content-between px-1">
          <span class="hl-thin">costo</span>
        <span class="hl-bold">{{Math.round(gasolina * 20, 2) | money}}</span>
        </div>
      </div>
      <div class="footer-item actions-field">
        <a class='dropdown-trigger waves-effect waves-light btn-small white-text' href='#' data-target='dropdown1'>Acciones</a>
        <ul id='dropdown1' class='dropdown-content'>
          <li><a href="#!" @click="openClientsModal">Asignar Clientes</a></li>
          <li><a href="#!" @click="exoportClients">Exportar</a></li>
          <li class="divider" tabindex="-1"></li>
          <li><a href="#!" @click="toggleMenu">{{ isMenuOpen ? 'Cerrar' : 'Abrir' }} menu</a></li>
        </ul>
      </div>
    </div>
    <ul id="slide-out" class="sidenav map-sidenav">
      <div class="p-1 h-100 d-flex flex-column">
        <a href="#" @click="closeMenu">Cerrar</a>
        <div class="input-field flex-shrink-0">
          <select v-model="selectedRoute">
            <option :value="null">Selecciona una ruta</option>
            <option :value="route.id" v-for="route in totalRoutes" :key="route.id">{{route.name}}</option>
          </select>
          <label>Rutas</label>
        </div>
        <div class="clients flex-grow-1 overflow-auto">
          <ul v-if="selectedClients.length > 0" class="collection with-header">
            <li class="collection-item" v-for="(client, index) in selectedClients" :key="'slectedClient-'+index">
              <div class="d-flex align-center justify-content-between">
                <div>
                  <p class="hl-bold m-0 primary">{{client.name}} ({{client.clave}})</p>
                  <small class="primary">
                    {{client.direccion}}
                  </small>
                </div>
                <a href="#!" @click="removeClient(client.clave)" class="secondary-content red-text text-darken-4;"><i class="material-icons">clear</i></a>
                </div>
            </li>
          </ul>
          <div v-if="selectedClients.length === 0" class="d-flex h-100 align-center justify-content-center">
            <h6 class="primary hl-thin">
              No ha seleccionado ningun cliente.
            </h6>
          </div>
        </div>
        <div class="center flex-shrink-0">
          <button @click="reassignClients" class="btn btn-primary">Asignar</button>
        </div>
      </div>
    </ul>
  </div>
</template>

<script>
import { displayError, displayMessage } from '../../assets/js/utilities';
import { Route } from '../../models/route';

export default {
  name: 'map-info',
  props: ['suc'],
  data: () => ({
    modalInstance: null,
    selectedRoute: null,
  }),
  mounted() {
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
      alignment: 'top',
      closeOnClick: true,
      constrainWidth: false,
    });
    const [instance] = M.Sidenav.init(document.querySelectorAll('.map-sidenav'), {
      edge: 'right',
    });
    this.modalInstance = instance;
  },
  updated(){
    M.FormSelect.init(document.querySelectorAll('select'),);
  },
  computed: {
    totalRoutes() {
      return Object.values(this.$store.state.routes).filter(route => !!route.id);
    },
    selectedRoutes() {
      return this.$store.state.selectedRoutes;
    },
    routes() {
      return this.selectedRoutes.map((id) => this.$store.state.routes[id]);
    },
    distancia() {
      return Object.values(this.routes).reduce((total, route) => total += route.distancia, 0);
    },
    tiempo() {
      return Object.values(this.routes).reduce((total, route) => total += route.tiempo, 0);
    },
    gasolina() {
      return Object.values(this.routes).reduce((total, route) => total += route.gasolina, 0);
    },
    isMenuOpen() {
      return this.$store.state.isMenuOpen;
    },
    selectedClients() {
      return this.$store.state.selectedClients;
    },
  },
  methods: {
    handleMarkerClick({ info: client, isSelected }) {
      this.$store.dispatch(isSelected ? 'ADD_CLIENT' : 'REMOVE_CLIENT', client);
    },
    openClientsModal() {
      this.modalInstance.open();
    },
    exoportClients() {
      const routes = this.selectedRoutes.join(',');
      if (!routes) {
        displayError('Selecciona al menos una ruta');
        return;
      }
      window.open(`http://187.237.145.198/HLApp/controllers/rutas/rutasExcel.php?routes=${routes}&suc=${this.suc}`, '_blank');
    },
    async reassignClients() {
      await axios.post(`${env.RUTAS_API_URL}?option=updateClientRoute`, {
        routeId: this.selectedRoute,
        clients: this.selectedClients.map(client => client.clave)
      });
      window.location.reload();
      // displayMessage('Asignado correctamente!');
      // this.clearClients();
      // this.modalInstance.close();
      // const response = await axios.post(`${env.RUTAS_API_URL}?option=getRoutes`, { suc: this.suc });
      // let routes = response.data.map(route => ({ ...route, checked: false }));
      // routes = this.routes.map(route => new Route(route, null, this.handleMarkerClick));
      // this.$store.dispatch({
      //   type: 'SET_ROUTES',
      //   routes: routes
      // });
    },
    toggleMenu() {
      this.$store.commit('toggleMenu');
    },
    clearClients() {
      this.selectedClients.forEach((client) => this.$store.dispatch('REMOVE_CLIENT', client));
      Object.values(this.$store.state.routes)
        .reduce((clients,route) => clients.concat(route.getSelectedPlaces()), [])
        .forEach(client => client.marker.unselectMarker());
    },
    removeClient(clave) {
      const client = Object.values(this.$store.state.routes)
      .reduce((clients,route) => clients.concat(route.getSelectedPlaces()), [])
      .find((client) => client.info.clave === clave);
      client.marker.unselectMarker();
      this.$store.dispatch('REMOVE_CLIENT', { clave });
    },
    closeMenu(){
      this.modalInstance.close();
    }
  },
  filters: {
    tiempo(val) {
      if(!val) return '0h 0m 0s';
      const hours = Math.floor(val / 3600);
      let seconds = val % 3600;
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      seconds = Math.round(seconds * 10) / 10;
      return `${hours}h ${minutes}m ${seconds}s`;
    },
    km(val) {
      if(!val) return '0 km';
      return `${Math.round(val*10)/10} km`;
    },
    gasolina(val) {
      if(!val) return '0 L';
      return`${Math.round(val*10) / 10} L`;
    }
  }
}
</script>

<style lang="scss" scoped>
  .sidenav {
    width: 400px;
  }
  .contents {
    display: contents;
  }
  .main-footer {
    height: 100%;
    color: #2d3a8d;
    .footer-item {
      display: flex;
      width: 25%;
    }
  }
  .info-field {
    position: relative;
    &:after {
      position: absolute;
      content: '';
      width: 0;
      height: 0;
      left: 0;
      bottom: 0;
      border-top: 25px solid transparent;
      border-bottom: 25px solid transparent;
      border-left: 25px solid #c2c2c2;
    }
  }
  .b-l {
    border-left: 2px solid #c2c2c2;
  }
  .b-rl {
    border-left: 2px solid #c2c2c2;
    border-right: 2px solid #c2c2c2;
  }

  .info-field, .actions-field {
    justify-content: center;
    align-items: center;
  }
</style>