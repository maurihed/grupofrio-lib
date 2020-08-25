<template>
  <div class="tanque">
    <div v-for="f in Number(filas)" :key="f" class="tanque__row">
      <div v-for="c in Number(columnas)" :key="c" class="tanque__col">
        <div v-for="ca in Number(canastillas)" :key="ca" class="tanque__canastilla"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['filas','columnas','canastillas'],
}
</script>
<style lang="scss" scoped>
  .tanque {
    border: 2px solid;
    border-radius: 5px;
    background: transparent;
    padding: 10px;
    padding-top: 20px;
      &__row {
      box-sizing: border-box;
      margin-bottom: 20px;
      display: flex;
      width: 100%;
      border-radius: 5px;
      justify-content: space-around;
    }
    &__col {
      @media (max-width: 353px) {
        margin: 0;
      }
      margin: 0 10px;
      border: 2px solid;
      padding: 10px;
      flex: 1;
      display: flex;
      justify-content: space-around;
      border-radius: 5px;
      cursor: pointer;
      background: #cfd8dc;
    }
    &__canastilla {
      margin: 0 2px;
      height: 20px;
      border: 2px solid;
      flex: 1;
      display: flex;
      justify-content: space-around;
      border-radius: 5px;
      background: #bbdefb;
    }
  }
</style>