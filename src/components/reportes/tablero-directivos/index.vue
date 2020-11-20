<template>
<div>
  Adios {{nombreData}}
  <br>
<ol>
  <li v-for="usuario in usuarios" :key="usuario.id">
    {{usuario.Nombre}}
  </li>
</ol>
<span v-if="algo()">no voy a salir</span>
  <input type="text" v-model="nombreData">
</div>
</template>

<script>
export default {
  name:'tablero-directivos',
  props: ['nombre'],
  data() {
    return {
      nombreData: '',
      usuarios: [],
    }
  },
  async created() {
    const respuesta = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=index`,{
      suc: 'SUC07', fecha_inicial: '2020-11-18', fecha_final: '2020-11-18'
    });
    this.usuarios = respuesta.data;
  },
  updated() {
      M.Collapsible.init(document.querySelectorAll('.collapsible'));
  },
  methods: {
    algo() {
      return true;
    },
  },
  computed: {
    nombreMayusculas() {
      return `En mayusculas: ${this.nombreData}`;
    }
  }
}
</script>
<style>

</style>