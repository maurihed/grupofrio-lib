<template>
  <div>
    <kpi-puesto
      :key="puesto.id"
      v-for="puesto in puestos"
      :suc="suc"
      :puesto="puesto"
      :puntos="getPuntos(puesto.id)"
    ></kpi-puesto>
    <!-- <input-modal
      confirmButton="Guardar"
      id="newKpi"
      title="Nuevo punto"
      inputLabel="Nombre"
      defaultValue="0"
      :onConfirm="handleConfirm"
      :onClose="handleClose"
      :isOpen="isModalOpen"
    ></input-modal> -->
  </div>
</template>

<script>
import InputModalVue from '../common/input-modal.vue';
import kpiPuestoVue from './kpi-puesto.vue';

  export default {
    name: 'crud-kpis',
    props: ['suc'],
    data: () => ({
      puestos: [],
      puntos: [],
      isModalOpen: false,
    }),
    async created() {
      await Promise.allSettled([
        this.fetchPuestos(),
        this.fetchPuntos()
      ]);
    },
    methods: {
      async fetchPuestos() {
        const response = await axios.get(`${env.CRUD_KPI}?option=getPuestos`);
        this.puestos = response.data;
      },
      async fetchPuntos() {
        const response = await axios.post(`${env.CRUD_KPI}?option=getPuntos&suc=${this.suc}`, { suc: this.suc })
        this.puntos = response.data;
      },
      getPuntos(puestoId) {
        return [...this.puntos.filter((punto) => punto.puesto_id == puestoId)];
      }
      // handleAddKpi(puesto) {
      //   this.isModalOpen = true;
      //   this.puestoSelected = puesto;
      // },
      // async handleConfirm(value) {
      //   this.isModalOpen = false;
      //   console.log('saving name: ', value, this.puestoSelected)
      // },
      // handleClose() {
      //   this.isModalOpen = false;
      //   console.log('closing...');
      // },
    },
    components: {
      'kpi-puesto': kpiPuestoVue,
      'input-modal': InputModalVue,
    }
  }
</script>

<style lang="scss" scoped>

</style>
