// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import http from './api/request'
import md5 from 'js-md5'
import store from './store'
import code from "./api/code"
import url from './api/url'
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.prototype.$http = http;
Vue.prototype.md5 = md5;
Vue.prototype.code = code;

// 登录验证拦截 （校验token）
router.beforeEach((to,from,next)=>{
    if (to.meta.title){
        document.title = to.meta.title;
    }
    if (to.name === 'Login'){
        if (!store.state.login.token){
            next();
            return;
        }
        http.post(url.checkToken,{access_token:store.state.login.token}).then(response=>{
            if (response.data.code === 200) {
                next({path:'/admin',redirect:to.path})
            }
            next();
        });

    } else {
        if (!store.state.login.token){
            next({path:'/login',redirect:to.path});
            return;
        }
        http.post(url.checkToken,{access_token:store.state.login.token}).then(response=>{
            if (response.data.code === code.FORBIDDEN){
                ElementUI.Message.warning(response.data.msg);
                localStorage.clear();
                next({path:'/login',redirect:to.path});
                return;
            }
            localStorage.setItem('urls',response.data.result.auth);
            let auth = store.state.login.auth_url === null ? localStorage.getItem('urls') : store.state.login.auth_url;
            //用户权限验证
            if (auth.indexOf(to.path)===-1 && to.name !=='Welcome' && store.state.login.username !== 'admin'){
                let params={},info = '你没有访问权限，请联系管理员【'+code.QQ+'】检验数据的正确性';
                params.username = store.state.login.username;
                params.info = JSON.stringify({url:to.path, info:info});
                http.post(url.logSave,params);
                ElementUI.MessageBox.alert(info,{callback:action=>{
                    location.href='tencent://message/?uin='+code.QQ+'&Site=后台权限认证&Menu=yes';
                }});
                next({path:'/login',redirect:to.path});
            } else {
                next();
            }
        });
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
