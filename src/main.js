import Vue from 'vue'
import App from '@/App.vue'
import { router } from '@/router';
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import api from '@/api'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$http = api;
api.defaults.timeout = 10000;

/* api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.common["Authorization"] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
); */
api.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    if(error.response){  
      switch (error.response.status) {
        case 401:
          if (error.config.url != '/weblogin'){
            alert("sessione scaduta");
            break;
          }else{
            return Promise.reject(error.response.status);
          }
        default:
          alert(error.response);
          break;
      }
      router.replace({
        path: "/login",
        query: { redirect: router.currentRoute.fullPath }
      });
      return Promise.reject(error.response);
    }else{
      if (error.config.url != '/weblogin'){
        alert(error.message);
      }
      return Promise.reject(error.message);
    }
  }
);

