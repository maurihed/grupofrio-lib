<template>
<div>
  <div class="cell-container" v-if="typeof value == 'object'">
    <div class="cell dashed">
      <span class="cell-name">REAL:</span>
      <span class="cell-value">{{value.real | number}}</span>
    </div>
    <div class="cell">
      <span class="cell-name">META:</span>
      <span class="cell-value">{{value.meta | number}}</span>
    </div>
    <div class="cell" :class="getClass(porcentaje)">
      <span class="cell-name">%:</span>
      <span class="cell-value">{{porcentaje | number}} %</span>
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
        return 'bueno';
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
        return Math.floor(porcentaje ? porcentaje : ((real / meta) * 100));
      }
      return 0;
    }
  }
}
</script>
<style lang="scss" scoped>
  .cell-container {
    width: 100%;
    padding: 0 7.5%;
    text-align: center;
    .cell {
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      border-radius: 1rem;
      border: 1px dashed #2e3b8d;
      color: #6a6a6a;
      font-family: "axiforma bold";
      font-weight: bold;
      background: #FFF;
      margin-bottom: .5rem;
    }
      .bueno {
        border: 2px solid #84d0c1;
        background: #c9fef6;
      }
      .malo {
        border: 2px solid #f5b0b6;
        background: #ffd7e1;
      }
      .regular {
        border: 2px solid #c7cbd0;
        background: #f9f2d0;
      }
      .dashed {
        border: 1px solid #2e3b8d;
      }
  }
</style>