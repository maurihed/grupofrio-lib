<template>
<div>
  <div class="panel" v-if="typeof value == 'object'">
    <div class="panel-container">
        <div class="real w-50">
          <small>Real:</small>
          <div>
            {{value.real | number}}
          </div>
        </div>
        <div class="meta w-50">
          <small>Meta:</small>
          <div>
            {{value.meta | number}}
          </div>
        </div>
        <div class="porcentaje w-100 text-darken-4" :class="{'red-text': porcentaje < 80, 'green-text': porcentaje > 80}">{{porcentaje}} %</div>
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
  computed: {
    porcentaje() {
      if (typeof this.value == 'object') {
        const { meta, real } = this.value;
        if (!meta) {
          return 0;
        }
        return ((real / meta) * 100).toFixed(2);
      }
      return 0;
    }
  }
}
</script>
<style lang="scss" scoped>
  small{
    font-size: .9rem;
  }
  .panel {
    padding: 0;
    margin-bottom: 0;
    font-size: 1.1rem;
  }
  .panel-container {
    display: flex;
    flex-wrap: wrap;
  }
  .w-50 {
    width: 50%;
  }
  .w-100 {
    width: 100%;
  }
  .real {
    border-right: 1px solid #CCC;
  }
  .porcentaje {
    border-top: 1px solid #CCC;
  }
</style>