<template>
<div>
  <div class="cell-container" v-if="typeof value == 'object'">
    <div :class="{'cursor-pointer': !!realClickHandler && cellClickable.includes(indexName)}" @click="onRealClick" class="cell dashed">
      <span class="cell-name">{{real}}:</span>
      <span class="cell-value">{{value.real | number}}</span>
    </div>
    <div :class="{'cursor-pointer': !!metaClickHandler && cellClickable.includes(indexName)}" @click="onMetaClick" class="cell">
      <span class="cell-name">{{meta}}:</span>
      <span class="cell-value">{{value.meta | number}}</span>
    </div>
    <div @click="onPorcentajeClick" class="cell" :class="getClass(porcentaje)">
      <span class="cell-name">%</span>
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
  props: ['value','indexName','cellClickable', 'names','name', 'vendedor','turno', 'fecha', 'realClickHandler', 'metaClickHandler', 'porcentajeClickHandler'],
  methods: {
    getClass(porcentaje) {
      let className = '';
      if(!!this.porcentajeClickHandler && this.cellClickable.includes(this.indexName)) {
        className = 'cursor-pointer ';
      }
      if(this.name === 'agua' || this.nameCalculated === 'agua') {
        if(porcentaje > 100) {
          return className+'malo';
        }
        return className+'bueno';
      }
      if(porcentaje > 89){
        return className+'bueno';
      }
      if(porcentaje > 70){
        return className+'regular';
      }
      return className+'malo';
    },
    onRealClick() {
      if(this.realClickHandler) {
        const [vendedor] = this.vendedor ? this.vendedor.split('[') : [];
        const [turno] = this.turno ? this.turno.split('-') : [];
        this.realClickHandler(this.indexName, this.fecha, vendedor, turno);
      }
    },
    onMetaClick() {
      if(this.metaClickHandler) {
        this.metaClickHandler(this.fecha, this.vendedor, this.indexName);
      }
    },
    onPorcentajeClick() {
      if(this.porcentajeClickHandler) {
        this.porcentajeClickHandler(this.fecha, this.vendedor, this.indexName);
      }
    }
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
    },
    real() {
      if (typeof this.value == 'object') {
        return this.value.aliasReal || 'REAL';
      }
      return 'REAL';
    },
    meta() {
      if (typeof this.value == 'object') {
        return this.value.aliasMeta || 'META';
      }
      return 'META';
    },
    nameCalculated() {
      if(this.names && this.names.length && this.indexName) {
        return this.names[this.indexName] || '';
      }
      return '';
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
      border: 2px dashed #2e3b8d;
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