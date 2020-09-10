import Vue from "vue";
import VueRouter from "vue-router";
import App from "@/views/vApp/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/"
  },
  {
    path: "/",
    name: "vApp",
    component: App
  }
];

const router = new VueRouter({
  // mode: "history",
  routes
});

export default router;
