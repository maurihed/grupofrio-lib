<template>
  <div class="card m-0 mb-1 p-1">
    <h6 class="center text-bold primary">{{puesto.name}}</h6>
    <div v-if="!puntos.length" class="border rounded center"> No hay puntos.</div>
    <kpi-row
      v-for="punto in puntos"
      :key="punto.id"
      :punto="punto"
      :onSave="saveHandler"
    ></kpi-row>
    <div class="center">
    </div>
  </div>
</template>

<script>
import { displayError, displayMessage } from '../../assets/js/utilities'
import KpiRowVue from './kpi-row.vue'
export default {
  name: 'kpi-puesto',
  props: ['puesto', 'puntos', 'suc'],
  methods: {
    async saveHandler(punto, value) {
      const response = await axios.post(`${env.CRUD_KPI}?option=savePunto`, { suc: this.suc, id: punto.id, value })
      if (response.data) {
        displayMessage('Guardado correctamente!')
      } else {
        displayError('Algo salio mal, intentelo mas tarde.')
      }
    },
  },
  components: {
    'kpi-row': KpiRowVue,
  }
}
</script>
