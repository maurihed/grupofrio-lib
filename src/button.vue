<template>
  <div>
    <button class="waves-effect btn red darker-4" @click="deleteItem(1)">Borrar 1</button>
    <button class="waves-effect btn red darker-4" @click="deleteItem(2)">Borrar 2</button>
    <button class="waves-effect btn red darker-4" @click="deleteItem(3)">Borrar 3</button>
      <confirm-modal
        id="confirmationModal"
        :target-id="activeId"
        :confirm-url="url"
        :onConfirm="handleConfirm"
      >
      </confirm-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: `${env.ASPECTOS_LIMPIEZA_URL}?option=getAspectoLimpieza`,
      activeId: 0,
    }
  },
  props: [],
  methods: {
    deleteItem(id) {
      this.activeId = id;
      M.Modal.getInstance(document.getElementById("confirmationModal")).open();
    },
    handleConfirm(id, data) {
      console.log({ id, data });
    }
  }
}
</script>

<style lang="scss">
  button {
    background: blue;
    padding: 1em;
    border: none;
    color: white;
  }
</style>