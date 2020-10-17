<template>
<div>
  <div class="cell-container" v-if="typeof value == 'object'">
    <div class="cell">
      <span class="cell-name">REAL:</span>
      <span class="cell-value">{{value.real | number}}</span>
    </div>
    <div class="cell">
      <span class="cell-name">META:</span>
      <span class="cell-value">{{value.meta | number}}</span>
    </div>
    <div class="cell">
      <span class="cell-name">%:</span>
      <span class="cell-value" :class="getClass(porcentaje)">{{value.porcentaje | number}} %</span>
    </div>
  </div>
  <div class="center" v-if="typeof value != 'object'">
    <span>{{value}}</span>
  </div>
</div>
</template>
<script>
export default {
  props: ['value'],
  methods: {
    getClass(porcentaje) {
      if(porcentaje > 90){
        return 'buemo';
      }
      if(porcentaje > 60){
        return 'regular';
      }
      return 'malo';
    },
  },
  computed: {
    porcentaje() {
      if (typeof this.value == 'object') {
        const { meta, real, porcentaje } = this.value;
        if (!meta) {
          return 0;
        }
        return porcentaje ? porcentaje : ((real / meta) * 100).toFixed(2);
      }
      return 0;
    }
  }
}
</script>
<style lang="scss" scoped>
  .cell-container {
    width: 90%;
    text-align: center;
    .cell {
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      border-radius: 1rem;
      color: #444444;
      font-family: "axiforma bold";
      font-weight: bold;
      background: #FFF;
      margin-bottom: .5rem;
      .bueno {
        color: #84d0c1;
      }
      .malo {
        color: #f5b0b6;
      }
      .regular {
        color: #ecd9a4;
      }
    }
  }
</style>