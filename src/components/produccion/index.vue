<template>
  <div>
    <tanque-produccion
      v-if="!tanqueSelected"
      :suc="suc"
      v-model="tanqueSelected"
    ></tanque-produccion>
    <button v-if="!!tanqueSelected" class="btn-custom" @click="cambiarTanque">Cambiar tanque</button>
    <detalle-tanque
      v-if="!!tanqueSelected"
      :tanque="tanqueSelected"
      :on-click="irAOrden"
    ></detalle-tanque>
  </div>
</template>
<script>
import tanquesProduccionVue from './tanques-produccion.vue';
import detalleTanqueVue from './detalle-tanque.vue';
import { numberToLetter } from '../../assets/js/utilities';

export default {
  props: ['suc','infoOrden'],
  data() {
    return {
      tanqueSelected: null,
    };
  },
  components: {
    'tanque-produccion': tanquesProduccionVue,
    'detalle-tanque': detalleTanqueVue,
  },
  methods: {
    cambiarTanque() {
      this.tanqueSelected = null;
    },
    irAOrden(filaCol) {
      const o = JSON.parse(this.infoOrden);
      const id = this.tanqueSelected.id_hana;
      const columna = numberToLetter(filaCol.columna);
      const { fila } = filaCol;
      const tanqueId = `${this.suc}_T${id}_${columna}${fila}_${filaCol.canastillas}`;
      const idT = this.tanqueSelected.idMaquinas;
      const url = `http://187.188.181.34/HLApp/core/produccion/OrdenTrabajo.php?id=${o.id}&articulo=${o.articulo}&Sucursal=${o.Sucursal}&SerieP=${o.SerieP}&SerieE=${o.SerieE}&docEntry=${o.docEntry}&TanqueID=${tanqueId}&Planeada=${o.Planeada}&Generada=${o.Generada}&tanqueId=${idT}`;
      window.location.href = url;
    }
  }
}
</script>
