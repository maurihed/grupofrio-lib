<template>
  <div>
    <div v-if="!isLoaded" class="center">
      <br>
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
    <div v-if="isLoaded" class="tanque-produccion">
      <div v-for="tanque in tanques" :key="tanque.idMaquinas" class="tanque" role="button" @click="selectTanque(tanque.idMaquinas)">
        {{tanque.Nombre}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['suc', 'value'],
  data() {
    return {
      selectedTanque: 0,
      isLoaded: false,
      tanques: [],
    }
  },
  async created() {
    const response = await axios.post(`${env.TANQUE_PRODUCCION}?option=getTanques`, { suc: this.suc});
    this.tanques = response.data;
    this.isLoaded = true;
  },
  methods: {
    selectTanque(id) {
      this.selectedTanque = this.tanques.find((t) => t.idMaquinas === id);
      this.$emit('input', this.selectedTanque)
    }
  },
}
</script>
<style lang="scss" scoped>
  .tanque-produccion {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .tanque {
    padding: 1em;
    border: 2px solid gray;
    background: #d8e1f7;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
    width: 48%;
    margin: 1%;
  }
</style>