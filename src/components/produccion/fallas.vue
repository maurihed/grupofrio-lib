<template>
  <div>
    <div v-if="!isLoaded" class="center">
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoaded">
      <div class="row" v-if="fallas.length">
        <div class="col l4 s2" v-for="falla in fallas" :key="falla.IdRecibo">
          <label :for="falla.IdRecibo">{{falla.U_Tfalla}}</label>
          <div class="switch">
            <label>
              No se solucionó
              <input
                :disabled="today"
                @change="updateFalla(falla.IdRecibo, $event.target.checked)"
                type="checkbox"
                :name="falla.IdRecibo"
                :id="falla.IdRecibo"
                :checked="falla.valor === '1'"  
              >
              <span class="lever"></span>
              Se solucionó
            </label>
          </div>
        </div>
      </div>
      <div v-if="!fallas.length">
        <div class="panel panel--success">
          No hubo errores en este turno.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { isToday, displayError, displayMessage } from '../../assets/js/utilities.js';
export default {
  props: ['fecha', 'turno', 'suc'],
  data() {
    return {
      fallas: [],
      today: true,
      isLoaded: false,
    }
  },
  async created() {
    this.fallas = await this.getFallas(this.fecha, this.turno, this.suc)
    this.today = isToday(this.fecha);
    this.isLoaded = true;
  },
  methods: {
    async getFallas(fecha, turno, suc) {
      const response = await axios.post(`${env.FALLAS_PRODUCCION}?option=getFallas`, {fecha, turno, suc});
      return response.data;  
    },
    async updateFalla(idRecibo, value) {
      const response = await axios.post(`${env.FALLAS_PRODUCCION}?option=updateFalla`, { idRecibo, value: value ? 1 : 0 });
      if(response.data && response.data.error) {
        displayError(response.data.error);
      } else {
        displayMessage('Falla actualizada correctamente')
      }
    }
  }
}
</script>
<style lang="scss">
.panel {
  padding: 1rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 500;
  &--success {
    background: #c2f1cd;
    border: 1px solid #007100;
    color: #063e00;
  }
}
</style>