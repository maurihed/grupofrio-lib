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
      <br>
      <div>{{(counts * 100 / 4).toFixed(2)}}%</div>
    </div>
  </div>
  <div class="row">
    <div class="col s12">
      <panel-tabla
        :crecimiento="true"
        v-if="isLoaded"
        :porcentaje="[5]"
        :data="cconsumo"
        :total="true"
        :scrollable="false"
        titulo="Frecuencia centro consumo"
      >
      </panel-tabla>
    </div>
    <div class="col s12">
      <panel-tabla
        :crecimiento="true"
        v-if="isLoaded"
        :porcentaje="[5]"
        :data="moderno"
        :total="true"
        :scrollable="false"
        titulo="Frecuencia moderno"
      >
      </panel-tabla>
    </div>
    <div class="col s12">
      <panel-tabla
        :crecimiento="true"
        v-if="isLoaded"
        :porcentaje="[5]"
        :data="tradicional"
        :total="true"
        :scrollable="false"
        titulo="Frecuencia Tradicional"
      >
      </panel-tabla>
    </div>
    <div class="col s12">
      <panel-tabla
        :crecimiento="true"
        v-if="isLoaded"
        :porcentaje="[5]"
        :data="recuperar"
        :total="true"
        :scrollable="false"
        titulo="Frecuencia Recuperar"
      >
      </panel-tabla>
    </div>
  </div>
</div>
</template>
<script>
  export default {
    props:['fechaInicial', 'fechaFinal'],
    data() {
      return {
        data: {},
        isLoaded: false,
        cconsumo: {},
        moderno: {},
        tradicional: {},
        recuperar: {},
        counts: 0,
      };
    },
    async created() {
        const responseCConsumo = await axios.post(`${env.REPORTES_FRECUENCIA_SUCURSALES}?option=index`,
          { canal: "2", fecha_inicial: this.fechaInicial, fecha_final: this.fechaFinal }
        );
        this.cconsumo = responseCConsumo.data;
        this.counts++;
        const responseModerno = await axios.post(`${env.REPORTES_FRECUENCIA_SUCURSALES}?option=index`,
          { canal: "3", fecha_inicial: this.fechaInicial, fecha_final: this.fechaFinal }
        );
        this.moderno = responseModerno.data;
        this.counts++;
        const responseTradicional = await axios.post(`${env.REPORTES_FRECUENCIA_SUCURSALES}?option=index`,
          { canal: "4", fecha_inicial: this.fechaInicial, fecha_final: this.fechaFinal }
        );
        this.tradicional = responseTradicional.data;
        this.counts++;
        const responseRecuperar = await axios.post(`${env.REPORTES_FRECUENCIA_SUCURSALES}?option=index`,
          { canal: "5", fecha_inicial: this.fechaInicial, fecha_final: this.fechaFinal }
        );
        this.recuperar = responseRecuperar.data;
        this.counts++;
        this.isLoaded = true;
    }
  }
</script>
