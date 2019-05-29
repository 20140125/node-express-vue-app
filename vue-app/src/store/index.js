import Vue from 'vue';
import Vuex from 'vuex';
import tabs from './modules/tabs'
import fileTabs from './modules/fileTabs'
import api from './modules/api'
import login from './modules/login'
Vue.use(Vuex);
/**
 * Vuex全局状态管理
 * @param options {Array} 用于渲染tabs的数组
 */
const store = new Vuex.Store({
    modules:{
        tabs,
        fileTabs,
        api,
        login
    }
});
export default store;