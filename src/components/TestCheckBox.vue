<template>
  <label>
    <input type="checkbox" v-model="setValue" @click="$emit('checkbox')" />
    <span></span>
  </label>
</template>
<script>
// import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
export default {
  props: {
    value: {
      type: [Boolean, Object, String],
      default: 'value'
    },
  },
  computed: {
    setValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
};
</script>
<style lang="scss" scoped>
:root {
  label {
    position: relative;
  }
  span {
    width: 14px;
    height: 14px;
    border: 1px solid #ccc;
    display: inline-block;
    border-radius: 2px;
    transition: all linear 0.3s;
    &:after {
      content: "";
      position: absolute;
      top: 1px;
      left: 6px;
      border-bottom: 1.2px solid #fff;
      border-right: 1.2px solid #fff;
      height: 6px;
      width: 2px;
      transform: rotate(45deg);
      visibility: hidden;
    }
  }
  input {
    display: none;
    &:checked ~ span {
      background: #00A11E;
      border: 1px solid #00A11E;
      border-radius: 2px;
      &:after {
        visibility: visible;
      }
    }
  }
}

</style>
