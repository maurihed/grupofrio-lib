<template>
  <div class="search-select-contaienr" ref="container">
    <div class="search-select">
      <small class="search-select__title primary">{{title}}</small>
      <div @click.stop="openDropdown" class="search-select__content">
        <input readonly class="search-select__item-selected" type="text" :value="optionSelected && optionSelected.label">
        <i class="small material-icons">arrow_drop_down</i>
      </div>
    </div>
    <div class="search-select__options" ref="options">
      <input @click.stop v-model="search" type="text" :placeholder="searchPlaceholder">
      <ul ref="ulOptions">
        <li v-for="option in filteredOptions" :key="option.id" @click="selectOption(option)">{{option.label}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '',
    },
    searchPlaceholder: {
      type: String,
      default: 'Buscar...'
    },
    value: String,
    options : {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data:() => ({
    dropdown: null,
    search: '',
    optionSelected: {}
  }),
  mounted() {
    setTimeout(()=>{
      const maxHeigth = window.innerHeight - this.$refs.container.getBoundingClientRect().y - 80;
      this.$refs.ulOptions.style.maxHeight = `${maxHeigth}px`;
    }, 0);
    window.document.body.addEventListener('click', this.closeDropdown.bind(this));
    this.optionSelected = this.options.find((option) => option.id === this.value) || {
      id: null,
      label: this.placeholder,
    };
  },
  unmounted() {
    window.document.body.removeEventListener('click', this.closeDropdown.bind(this));
  },
  methods: {
    openDropdown() {
      this.$refs.options.classList.add("search-select__options--show");
    },
    closeDropdown(event) {
      event.stopPropagation();
      const element = this.$refs.options;
      if (element) {
        element.classList.remove("search-select__options--show");
        this.search = '';
      }
    },
    selectOption(option) {
      this.optionSelected = {...option};
      this.$emit('input', this.optionSelected.id);
    }
  },
  computed: {
    filteredOptions() {
      const search = this.search.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
      return this.options.filter((option) => (
        option.label.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase().indexOf(search) >= 0
      ));
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-select-contaienr {
    position: relative;
  }
  .search-select {
    height: 58px;
    width: 100%;
    position: relative;
    &__title {
      font-size: .8rem;
      position: absolute;
      left: 0;
    }
    &__content {
      border-top: 1px solid #E1E1E1;
      position: absolute;
      height: calc(100% - 18px);
      top: 18px;
      width: 100%;
      color: #2e3b8d;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    &__item-selected {
      cursor: pointer;
      color: #2e3b8d !important;
      font-size: 1em !important;
      font-weight: 100;
      flex: 1;
      border-bottom: none !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &__icon {
      flex-shrink: 0;
    }
    &__options {
      &--show {
        display: block;
      }
      width: 100%;
      display: none;
      position: absolute;
      min-width: 100%;
      background: #fff;
      top: 18px;
      box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%);
      text-align: left;
      input {
        padding: 0 16px !important;
        box-sizing: border-box !important;
      }
      ul {
        overflow-y: auto;
        margin: 0;
        li {
          cursor: pointer;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 16px;
          color: #2d3a8d;
          display: block;
          line-height: 22px;
          padding: 14px 16px;
          &:hover {
            background: #EEEEEE;
          }
        }
      }
    }
  }
</style>