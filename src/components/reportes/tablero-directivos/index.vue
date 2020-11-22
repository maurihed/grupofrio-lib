<template>
<div>
  Adios {{fecha}}
  <br>
<ol>
  <li v-for="usuario in usuarios" :key="usuario.id">
    {{usuario.Nombre}}
  </li>
</ol>
<span v-if="algo()">-----</span>
  <input type="text" v-model="fecha">
</div>
</template>

<script>
export default {
  name:'tablero-directivos',
  props: ['fecha'],
  data() {
    return {
      fecha: '',
      usuarios: [],
    }
  },
  async created() {
    const respuesta = await axios.post(`${env.TABLERO_DIRECTIVOS}?option=gerente`,{
      fecha: this.fecha
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
      return `En mayusculas: ${this.fecha}`;
    }
  }
}
</script>
<style>

</style>