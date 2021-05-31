<template>
  <div>
    <ul class="collapsible" data-collapsible="accordion" >
      <li v-for="(tipo, name) in tipos" :key="name">
        <div class="collapsible-header d-flex align-center">
          <div class="horizontal-line"></div>
          <span class="mx-1 text-bold primary">{{name}}</span>
          <div class="horizontal-line flex-grow-1"></div>
          <span class="header__icon">
              <i class="small material-icons">arrow_drop_down</i>
          </span>
          </div>
        <div class="collapsible-body" style="overflow-x:auto;">
          <div class="mermas">
            <div class="mermas__top"></div>
            <div class="mermas__header">
              <div class="mermas__title">MÉTRICAS</div>
              <div class="mermas__titles">
                <div class="mermas__itemTitle">INICIAL</div>
                <div class="mermas__itemTitle">FINAL</div>
                <div class="mermas__itemTitle">CONSUMO</div>
              </div>
            </div>
            <div class="mermas__item" v-for="variable in tipo" :key="variable.variable_id">
              <div class="mermas__item__title">
                {{variable.descripcion}}
              </div>
              <div class="mermas__item__value">
                <merma-input
                  v-model="variable.valor_inicial"
                  :documento="documento"
                  :idVar="variable.variable_id"
                  :hora="variable.hora_inicial"
                  tipo="inicial"
                >
                </merma-input>
              </div>
              <div class="mermas__item__value">
                <merma-input
                  v-if="!tipoBloqueados.includes(variable.descripcion)"
                  v-model="variable.valor_final"
                  :documento="documento"
                  :idVar="variable.variable_id"
                  :hora="variable.hora_final"
                  tipo="final"
                >
                </merma-input>
              </div>
              <div class="mermas__item__value">
                <span class="mermas__consumos">{{getConsumo(variable.valor_inicial, variable.valor_final, variable.multiplicador) | number}}</span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['documento'],
  data() {
    return {
      tipos: [],
      tipoBloqueados:['Carro Tanque','Compresor 1','Compresor 2','Compresor 3','Compresor 4','Compresor 5','Compresor 6','Grados Baume'],
    }
  },
  async created() {
    const response = await axios.post(`${env.EVAL_BITACORA_MERMA}?option=getVariables`,{ documento: this.documento });
    this.tipos = response.data;
  },
  mounted() {
    M.Collapsible.init(document.querySelectorAll('.collapsible'));
  },
  methods: {
    getConsumo(inicial, final, multiplicador = 1) {
      if (parseInt(inicial) && parseInt(final)) {
        return (final - inicial) * multiplicador;
      }
      if (parseInt(inicial)) {
        return inicial * multiplicador;
      }
      return 0;
    }
  },
  filters: {
    number(value) {
      if (!value) return 0;
      return new Intl.NumberFormat("en-IN").format(value);
    }
  },
}
</script>

<style lang="scss">
.header__icon {
  .small.material-icons {
    margin: 0;
    color: #2e3b8d;
  }
}
.horizontal-line {
  background: #c9ccd1;
  height: 2px;
  min-width: 30px;
}
.collapsible-body {
  padding: 0px !important;
  margin: 0px !important;
}
.mermas {
  &__top {
    height: 20px;
    background: #96a7c2;
  }
  &__header {
    height: 20px;
    background: #adbacf;
    display: flex;
  }
  &__title {
    background: #e4ebf3;
    text-align: center;
    color: #a9b2be;
    font-weight: 700;
    width: 200px;
    flex-shrink: 0;
  }
  &__titles {
    display: flex;
  }
  &__itemTitle {
    text-align: center;
    width: 200px;
    color: #eceff4;
  }
  &__item {
    height: 40px;
    background: #e6eaf3;
    display: flex;
    outline: 1px solid #a9b2be;
    &__title {
      color: #a9b2be;
      text-align: center;
      line-height: 40px;
      width: 200px;
      flex-shrink: 0;
      outline: 1px solid #a9b2be;
    }
    &__value {
      width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &__consumos {
    display: block;
    background: #ffffff;
    width: 80px;
    height: 20px;
    line-height: 20px;
    border: 1px solid #2e3b8d;
    border-radius: 10px;
    text-align: center;
  }
}
</style>