<template>
  <div class="client-item" :style="'border-left: 4px solid '+color">
    <div class="client-name">{{client.info.name}} ({{client.info.clave}})</div>
    <small class="client-address">{{client.info.direccion}}</small> <br>
    <small class="client-info">
      Dias de visita: <b>{{client.info.visitas}}</b> Capacidad: <b>{{Math.round(client.info.capacidad * 10) / 10 | number}} kg</b> distancia: <b>{{Math.round(client.info.distancia * 10)/10 | number}} km</b>
    </small>
  </div>
</template>

<script>
export default {
  name: 'client-item',
  props: ['client', 'color'],
}
</script>
<style lang="scss" scoped>
  .client-item {
    padding: .5rem;
    color: #2d3a8d;
    font-family: Axiforma, san-serif;
    margin-bottom: 1rem;
  }

  .client-name {
    font-weight: bold;
  }
</style>