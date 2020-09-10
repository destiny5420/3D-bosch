import Vue from "vue";
import App from "@/views/vApp/index.vue";

// import vuex
import Vuex from "vuex";
Vue.use(Vuex);

// import vue router
import VueRouter from "vue-router";
Vue.use(VueRouter);

// import vue axios
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

import * as THREE from "three";
Vue.use({
  install(Vue) {
    Vue.prototype.$THREE = THREE;
  }
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
