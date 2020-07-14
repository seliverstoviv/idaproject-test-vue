<template>
  <div id="app">
    <div class="error-messages" v-if="error">
      {{ errorMessages }} <button @click="getProducts()">Повторить</button>
    </div>
    <test-table v-else></test-table>
  </div>
</template>

<script>
import TestTable from "./components/TestTable.vue";
import { getProducts } from "./testApp/request";

export default {
  name: "App",
  components: {
    TestTable
  },
  data() {
    return {
      error: '',
      // Вдруг будут типы ошибок)))
      errorType: [
        { value: "Server Error", text: "Ошибка сервера, повторите попытку" }
      ]
    }
  },
  methods: {
    getProducts() {
      getProducts()
        .then(resp => {
          this.$store.commit('setProducts', resp);
          this.error = '';
        })
        .catch(err => {
          this.error = err.error;
        });
    },
  },
  computed: {
    errorMessages() {
      if (this.error) {
        let errorType = this.errorType.find(
          el => el.value.toLowerCase() === this.error.toLowerCase()
        );
        return errorType ? errorType.text : null;
      }
      return null;
    }
  },
  created() {
    this.getProducts();
  }
};
</script>

<style lang="scss">
body{
  background: #FBFBFB;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
