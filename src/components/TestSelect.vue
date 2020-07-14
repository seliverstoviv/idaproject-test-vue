<template>
  <div class="idp-select" v-click-outside="hideMenu">
    <div class="idp-input-control" @click="openSelectOpt">
      <div class="idp-input-value">
        {{ valueContent }}
      </div>
      <div class="idp-input-arrow">
        <img src="/img/chevron/down.svg"  :class="this.showMenu ? 'active-arrow' : ''"/>
      </div>
    </div>
    <div
      class="idp-opt-wrap"
      v-show="showMenu"
    >
      <slot v-if="multiple"> </slot>
      <div
        class="idp-select-list"
        role="listbox"
        tabindex="-1"
        ref="options"
        v-else-if="items.length > 0"

      >
        <div
          class="idp-select-item"
          role="option"
          tabindex="0"
          aria-selected="false"
          v-for="(item, index) in itemsComp"
          :key="'vse' + Math.random() + index"
          @click="setValue(item)"
        >
          {{ item.itemText }}
        </div>
      </div>
      <div class="idp-select-list" v-else>
        <div
          class="idp-select-item"
          role="option"
          tabindex="0"
          aria-selected="false"
        >
          Отсутствуют данные для отображения
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ClickOutside from 'vue-click-outside';
// import TestCheckBox from '@/components/TestCheckBox.vue';
// import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
export default {
  directives: {
    ClickOutside
  },
  components: {
    // TestCheckBox,
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    selectAll: {
      type: Boolean,
      default: false
    },
    customValue: {
      type: String,
      default: ''
    },
    selAllPosState: {
      type: Boolean,
      default: false
    },
    itemText: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Array, Function, Object],
      default: 'value',
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showMenu: false,
      resultArr: [],
      sResult: '',
    }
  },
  methods: {
    hideMenu() {
      this.showMenu = false;
    },
    openSelectOpt() {
      this.showMenu = !this.showMenu;
    },
    setValue(value) {
      this.$emit('input', value);
    }
  },
  computed: {
    itemsComp() {
      return this.items.map(entry => {
        if (entry[this.itemText]) {
          return Object.assign({}, { itemText: entry[this.itemText] }, entry);
        } else {
          return Object.assign({}, { itemText: 'Не выбрано поле' }, entry)
        }
      });
    },
    valueContent() {
      if (this.customValue && this.multiple) return this.customValue;
      else {
        for (let i = 0; i < this.itemsComp.length; i++) {
          if (this.value[this.itemText] === this.itemsComp[i][this.itemText]) {
            return this.value[this.itemText];
          }
        }
      }
      return 'noValue';
    }
  },
};
</script>
<style lang="scss">
.idp-select{
  .idp-input-control {
    padding: 0 12px;
    border: 1px solid #D5DAE0;
    border-radius: 2px;
    display: flex;
    align-items: center;
    max-height: 25px;
    cursor: pointer;
    .idp-input-value {
      flex: 1 1 auto;
      font-size: 14px;
    }
    .idp-input-arrow {
      margin-right: -4px;
      margin-top: 4px;
      img{
        transition: all ease 0.2s;
      }
      .active-arrow {
        transform: rotate(180deg);
      }
    }
  }
  .idp-opt-wrap {
    position: absolute;
    z-index: 9;
    background: white;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
    padding: 9px 18px;
    border-radius: 4px;
    margin-top: 14px;
  }
}
.idp-select-item {
  display: flex;
  font-size: 14px;
  padding: 5px 0;
  outline: none;
  cursor: pointer;
  &:hover {
    font-weight: 500;
  }
  .idp-checkbox{
    margin-right: 14px;
  }
}
</style>