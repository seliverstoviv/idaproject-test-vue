import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: []
  },
  mutations: {
    setProducts(store, products) {
      // store.products = Object.values(products);
      store.products = products;
    },
    removeProducts(store, payload) {
      // console.log(payload);
      // Тут можно использовать Lodash, но тестовое задание, есть тестовое задание
      let newProducts = [];
      for (let i = 0; i < store.products.length; i++) {
        let findProduct = false;
        for (let j = 0; j < payload.length; j++) {
          if (store.products[i].id === payload[j].id) {
            findProduct = true;
            break;
          }
        }
        if (!findProduct) newProducts.push(store.products[i]);
      }
      store.products = newProducts;
    }
  },
  actions: {

  },
  modules: {}
});
