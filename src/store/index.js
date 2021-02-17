export const store = {
  state: {
    routeIds: [],
    routes: {},
    selectedRoutes: [],
    isMenuOpen: true,
    map: null,
    selectedClients: [],
  },
  mutations: {
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
    }
  },
  actions: {
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
  }
};
