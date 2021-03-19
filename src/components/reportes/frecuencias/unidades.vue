<template>
<div>
  <div v-if="!isLoaded">
    <div class="center">
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
  </div>
  <panel-tabla
    v-if="isLoaded"
    :porcentaje="[4,5]"
    :data="data"
    :scrollable="false"
    titulo="Frecuencia vendedores"
    :crecimiento="true"
  >
  </panel-tabla>
</div>
</template>
<script>
  export default {
    props:['suc', 'fechaInicial', 'fechaFinal'],
    data() {
      return {
        data: {},
        isLoaded: false,
      };
    },
    async created() {
        const response = await axios.post(`${env.REPORTES_FRECUENCIA_UNIDADES}?option=index`,
          { suc:this.suc, fecha_inicial: this.fechaInicial, fecha_final: this.fechaFinal }
        );
        this.data = response.data;
        this.isLoaded = true;
    }
  }
</script>

<style>

</style>