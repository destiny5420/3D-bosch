import Vue from "vue";
import App from "@/views/vApp/index.vue";

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
