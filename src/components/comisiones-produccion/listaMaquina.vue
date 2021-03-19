<template>
  <div class="table-conteiner" v-if="show">
    <label class="title-table">Variables por <span>maquina</span></label>
    <table class="centered">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Sucursal</th>
          <th>Variables</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Tanque 1</td>
          <td>Morelia</td>
          <td>
            <a class="orange-text accent-4"><i class="material-icons">description</i></a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: ['show', 'maquinas'],
  data() {
    return {

    }
  }
}
</script>