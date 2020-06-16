import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue'
import dashboard from '@/components/dashboard.vue'
Vue.use(Router)

export const router = new Router ({
  mode: 'history',
  routes: [
    { path: '/', name: 'main', component: dashboard, props: {userid : localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).username:''}},
    { path: '/login', name: 'login',  component: login}//,
    // otherwise redirect to login
    //{ path: '*', redirect: '/login'}
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');
  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
})

export default {}