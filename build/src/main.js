// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from "./util/currency";
import Vuex from 'vuex'
Vue.config.productionTip = false
Vue.use(infiniteScroll)
Vue.use(Vuex)
Vue.filter("currency",currency)
Vue.use(VueLazyLoad,{
  loading:"static/loading-svg/loading-bars.svg",
  try:3
});
  /* eslint-disable no-new */
const store = new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount = cartCount;
    },
    setCartCount(state){
      state.cartCount = 0;
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

