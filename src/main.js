import Vue from "vue";
import App from "@/views/vApp/index.vue";
import router from "@/router"; // vue-router instance
import store from "@/store"; // vuex store instance

// import vue axios
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

// import vue-router-sync
import { sync } from "vuex-router-sync";
sync(store, router);

// import three
import * as THREE from "three";
Vue.use({
  install(Vue) {
    Vue.prototype.$THREE = THREE;
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
