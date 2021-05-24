<template>
  <div>
    <div class="rutas-info-bar">
      <rutas-info-title>
        <h5>Frecuencias</h5>
      </rutas-info-title>
      <div class="d-flex rutas-info">
        <div class="rutas-camionetas">
          <img src="http://187.188.181.34/HLApp/img/icono_user.png" alt="car">
          <div class="input-field m-0 flex-grow-1">
            <select v-model="vendedorSelected" @change="fetchVendedorInfo">
              <option :value="null" disabled>Escoge un vendedor</option>
              <option v-for="vendedor in vendedores" :value="vendedor" :key="vendedor.idVendedor">{{vendedor.NOMBRE}}</option>
            </select>
          </div>
          <img src="http://187.188.181.34/HLApp/img/icono_user.png" alt="car">
          <div class="d-flex align-center flex-grow-1">
            <span class="text-bold">{{vendedorSelected.vehiculo_id}}</span>
          </div>
        </div>
        <slot></slot>
      </div>
    </div>
    <div class="rutas-container">
      <localizador-menu :suc="suc"></localizador-menu>
      <div class="rutas-body">
        <div class="rutas-map">
          <localizador-map ></localizador-map>
        </div>
        <div class="map-footer">
          <localizador-footer suc="SUC04" :isFrecuencias="true"></localizador-footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LocalizadorMenuVue from './components/LocalizadorMenu.vue';
import LocalizadorMapVue from './components/LocalizadorMap.vue';
import LocalizadorFooterVue from './components/LocalizadorFooter.vue';
import RutasInfoTitleVue from '../rutas/rutas-info-title.vue';
import { SellerMarker } from '../../models/localizador/sellerMarker';
import { today } from '../../assets/js/date-utilities';

export default {
  name: 'v-localizador',
  props: ['suc'],
  data: () => ({
    clients: [],
    gasolina: 19.5,
    vendedores: [],
    vendedorSelected: {},
    fecha: null,
    sellerMarker: null, 
  }),
  computed: {
    map() {
      const map = this.$store.state.map;
      return this.$store.state.map;
    },
    trankingInfo() {
      const { trankingInfo } = this.$store.state.localizador;
      const newPosition = { isAwake: trankingInfo.isAwake, ...trankingInfo.location };
      return newPosition;
    },
  },
  components: {
    'rutas-info-title': RutasInfoTitleVue,
    'localizador-menu': LocalizadorMenuVue,
    'localizador-map': LocalizadorMapVue,
    'localizador-footer': LocalizadorFooterVue,
  },
  async created() {
    this.fecha = today();
    await this.fetchVendedores();
    this.vendedorSelected = this.vendedores[0] || null;
    await this.fetchVendedorInfo();
  },
  mounted() {
    M.updateTextFields();
  },
  updated() {
    M.FormSelect.init(document.querySelectorAll('select'));
  },
  methods: {
    async fetchVendedores() {
      const response = await axios.post(`${env.LOCALIZADOR_API}?option=getVendedores`, {suc: this.suc});
      this.vendedores = response.data;
    },
    async fetchVendedorInfo() {
      this.$store.dispatch('SET_LOCALIZADOR_VENDEDOR', this.vendedorSelected);
      this.$store.dispatch('GET_VENDEDOR_INFO', { chofer: this.vendedorSelected.idVendedor, fecha: this.fecha });
      this.$store.dispatch('GET_ROUTE_INFO', { vendedorId: this.vendedorSelected.idVendedor, fecha: this.fecha });
      this.$store.dispatch('FETCH_DATOS_RASTREO', { chofer: this.vendedorSelected.idVendedor, fecha: this.fecha });

      // this.$store.dispatch('FOLLOW_VENDEDOR');
    }
  },
  watch: {
    trankingInfo() {
      if (this.sellerMarker) {
        this.sellerMarker.updatePosition(this.trankingInfo);
      }
    },
    map() {
      if (!this.sellerMarker) {
        this.sellerMarker = new SellerMarker(this.trankingInfo, this.map);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .rutas-container {
    height: calc(100vh - 130px) !important;
  }
  .rutas-info {
    .input-field {
      width: 250px;
    }
    .select-dropdown.dropdown-trigger {
      margin: 0;
    }
    .select-wrapper input.select-dropdown {
      padding-left: 0;
    }
  }
  .rutas-camionetas {
    display: flex;
    flex: 1;
    img {
      width: auto;
      height: 30px;
      margin: 10px 0.5rem;
    }
  }
  #gasoline_price {
    height: 30px;
    margin-bottom: 0;
  }
  .total_gasolina {
    display: flex;
    margin: 0 1rem;
    flex-direction: column;
    justify-content: center;
    border-left: 2px solid #9e9e9e;
    border-right: 2px solid #9e9e9e;
    color: #9e9e9e;
    span {
      text-align: center;
      width: 250px;
    }
  }
</style>
