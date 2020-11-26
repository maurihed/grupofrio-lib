<template>
  <div class="border rounded mb-1">
      <div class="d-flex align-center flex-wrap">
        <span class="text-bold secondary px-1">{{punto.nombre}}</span>
        <div class="input-field input-filed-small col s6 m-0">
          <input class="center" type="text" v-model="newValue">
        </div>
        <button @click="onSave(punto, newValue)" class="btn-floating btn-small mx-1"><i class="material-icons">save</i></button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'kpi-row',
  props: ['punto', 'onSave'],
  data: () => ({
    newValue: 0,
  }),
  created() {
    this.newValue = this.punto.valor;
  }
}
</script>

<style>

</style>