<template>
  <div class="reporte-card">
    <p v-for="([key, value], index) in Object.entries(data)" :key="key">
      <span class="text-bold primary">{{key}}: </span>
      <span v-if="moneyFormat.includes(index)" class="secondary">{{value | money}}</span>
      <span v-if="!moneyFormat.includes(index)" class="secondary">{{value | number}}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'reporte-card',
  props: {
    data: Object,
    moneyFormat: {
      type: Array,
      default: function () {
        return [];
      }
    },
  },
  mounted(){
    console.log(this.data, this.moneyFormat)
  }
}
</script>

<style lang="scss" scoped>
  .reporte-card {
    background: #fbfcfb;
    outline: 1px solid #CCC;
    padding: 5px;
    height: 130px;
    overflow: auto;
    p {
      margin: 0 5px;
    }
  }
</style>