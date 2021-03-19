import { today } from '../assets/js/date-utilities';
import { Route } from '../models/localizador/route';

export const store = {
  state: {
    routeIds: [],
    routes: {},
    selectedRoutes: [],
    isMenuOpen: true,
    map: null,
    selectedClients: [],
    localizador: {
      trankingInfo: {
        interval: null,
        isTraking: false,
        isAwake: false,
        location: {
          latitud: 19.7085267,
          longitud: -101.1685035,
        }
      },
      vendedor: {},
      clientes: [],
      cancelaciones: [],
      totalVentas: {
        credito: 0,
        contado: 0,
        total: 0,
      },
      inicioRuta: {
        inicio: null,
        fin: null
      },
      ultimaVenta: null,
      ultimaUbicacion: null,
      kilosVendidos: 0,
      visitas: {
        conVenta: 0,
        soloVisita: 0,
        sinVisitar: 0
      },
      kilosVendidos: 0,
      ruta: null,
      isLoading: false
    }
  },
  mutations: {
    setMap(state, map) {
      state.map = map;
    },
    setLocalizadorRoute(state, ruta) {
      state.localizador.ruta = ruta;
    },
    setTrakingInfo(state, { location, isAwake }) {
      state.localizador.trankingInfo.location = location;
      state.localizador.trankingInfo.isAwake = isAwake;
    },
    setTrakingState(state, status) {
      state.localizador.trankingInfo.isTraking = status;
    },
    setLocalizadorInterval(state, interval) {
      state.localizador.trankingInfo.interval = interval;
    },
    setVendedorInfo(state, data) {
      const {
        cancelaciones,
        clientesAsignados,
        ventasContado,
        ventasCredito,
        inicioRuta: { hora_fin, hora_inicio },
        ultimaVenta,
        ultimaUbicacion,
        kilosVendidos } = data;
      const cancelados = cancelaciones.map(c => c.CLAVE_CLIENTE);
      const asignados = clientesAsignados.map(cliente => {
        if (cancelados.includes(cliente.clienteId)) {
          return {...cliente, estado: '2', comment: cancelaciones.find(c => c.CLAVE_CLIENTE === cliente.clienteId).COMENTARIO};
        }
        return { ...cliente };
      });
      // const especiales = asignados.reduce((total, cliente) => Number(cliente.estado) == 3 && (total + 1) || total, 0);
      state.localizador.visitas.sinVisitar = asignados.reduce((total, cliente) => Number(cliente.estado) == 0 && (total + 1) || total, 0);
      state.localizador.visitas.conVenta = asignados.reduce((total, cliente) => Number(cliente.estado) == 1 && (total + 1) || total, 0);
      state.localizador.visitas.soloVisita = asignados.reduce((total, cliente) => Number(cliente.estado) == 2 && (total + 1) || total, 0);
      // state.localizador.kilosVendidos = asignados.reduce((total, cliente) => total + Number(cliente,),0);
      state.localizador.cancelaciones = cancelaciones;
      state.localizador.clientes = asignados;
      state.localizador.totalVentas = {
        credito: Number(ventasCredito),
        contado: Number(ventasContado),
        total: Number(ventasCredito) + Number(ventasContado),
       };
      state.localizador.inicioRuta = { inicio: hora_inicio, fin: hora_fin };
      state.localizador.ultimaVenta = ultimaVenta == '0' ? '' : ultimaVenta;
      state.localizador.ultimaUbicacion = ultimaUbicacion;
      state.localizador.kilosVendidos = kilosVendidos || 0;
    },
    setLocalizadorVendedor(state, data) {
      state.localizador.vendedor = data;
    },
    setRoutes (state, routes) {
      state.routes = {...routes};
    },
    setSuc(state, suc) {
      state.suc = suc;
    },
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
    },
    selectRoute(state, routeId) {
      state.selectedRoutes = [...state.selectedRoutes, routeId];
    },
    unselectRoute(state, routeId) {
      state.selectedRoutes = [...state.selectedRoutes.filter(route => route !== routeId)]
    },
    setRouteIds(state, routeIds) {
      state.routeIds = [...routeIds];
    },
    addRouteInfo(state, { id, route }) {
      state.routes = { ...state.routes, [id]: route };
    },
    addClient(state, client) {
      state.selectedClients.push(client);
    },
    removeClient(state, client) {
      state.selectedClients = state.selectedClients.filter(c => c.clave !== client.clave)
    },
    setLoadingState(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  actions: {
    FOLLOW_VENDEDOR({ commit, state }) {
      const vendedor = state.localizador.vendedor;
      const params = new URLSearchParams();
      params.append('idChofer', vendedor.idVendedor);
      const interval = setInterval(async () => {
        const response = await axios.post(`${env.BASE_URL}/controllers/gpsDataReader.php`, params);
        commit('setTrakingInfo',{ location: response.data.ubicacion, isAwake: response.data.status === "Encendido"});
      }, 5000);
      commit('setTrakingState', true);
      commit('setLocalizadorInterval', interval);
    },
    UNFOLLOW_VENDEDOR({ state, commit }) {
      clearInterval(state.localizador.trankingInfo.interval);
      commit('setTrakingState', false);
      commit('setLocalizadorInterval', null);
    },
    async GET_VENDEDOR_INFO({ commit }, { chofer, fecha }) {
      const response = await axios.post(`${env.LOCALIZADOR_API}?option=getDatosRuta`, { chofer, fecha });
      commit('setVendedorInfo', response.data);
    },
    async GET_ROUTE_INFO({ commit, state }, { vendedorId, fecha }) {
      commit('setLoadingState', true);
      if (!fecha) {
        fecha = today();
      }
      const oldRoute = { ...state.localizador.ruta };
      if (oldRoute && oldRoute.isRendered) {
        oldRoute.remove();
      }
      const response = await axios.post(`${env.LOCALIZADOR_API}?option=getRoute`,{ chofer: vendedorId, fecha });
      const ruta = new Route(response.data);
      ruta.loadDirectionData();
      if (state.map) {
        ruta.setMap(state.map);
        ruta.render();
      }
      commit('setLocalizadorRoute', ruta);
      commit('setLoadingState', false);
    },
    SET_MAP({ commit, state }, map) {
      commit('setMap', map);
      if (state.localizador.ruta) {
        state.localizador.ruta.setMap(map);
        state.localizador.ruta.render();
      }
    },
    SET_ROUTES({ commit }, routes) {
      commit('setRoutes', routes);
    },
    SELECT_ROUTE ({ commit, state }, routeId) {
      const route = state.routes[routeId];
      if (!route.directionDataPromise) {
        route.loadDirectionData();
      }
      commit('selectRoute', routeId);
    },
    UNSELECT_ROUTE ({ commit, state }, routeId) {
      const route = state.routes[routeId];
      route.remove();
      commit('unselectRoute', routeId);
    },
    SET_FRECUENCIAS({ commit }, frecuencias) {
      const frecuenciasNames = frecuencias.map(frecuencia => frecuencia.name);
      let frecuenciasObj = {};
      frecuencias.forEach((frecuencia) => { frecuenciasObj[frecuencia.name] = frecuencia });
      commit('setRouteIds', frecuenciasNames);
      commit('setRoutes', frecuenciasObj);
    },
    SET_ROUTES({ commit }, { routes }) {
      const routeIds = routes.map((route) => route.id);
      const routesAsObj = {};
      routes.forEach((route) => { routesAsObj[route.id] = route });
      commit('setRouteIds', routeIds);
      commit('setRoutes', routesAsObj);
    },
    ADD_CLIENT({ commit }, client) {
      commit('addClient', client);
    },
    REMOVE_CLIENT({ commit }, client) {
      commit('removeClient', client);
    },
    RESET_ROUTES({ dispatch, state }) {
      state.selectedRoutes.forEach((route) => {
        dispatch('UNSELECT_ROUTE', route);
      });
    },
    SET_LOCALIZADOR_VENDEDOR({ commit, dispatch }, vendedor) {
      dispatch('UNFOLLOW_VENDEDOR');
      commit('setLocalizadorVendedor', vendedor);
    }
  }
};
