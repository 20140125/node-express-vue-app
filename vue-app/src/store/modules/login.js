import {Message} from "element-ui";
import http from '../../api/request'
import url from '../../../src/api/url'
import code from '../../../src/api/code'
import router from '../../router';
const state={
    token:localStorage.getItem('token'),
    username:localStorage.getItem('username'),
    auth_url:localStorage.getItem('urls'),
};
const getters={
    token:state=>state.token,
    username:state=>state.username,
    auth_url: state=>state.auth_url
};
const mutations={
    setToken:function (state,token) {
        state.token = token;
        localStorage.setItem('token',token)
    },
    setUserName:function (state,username) {
        state.username = username;
        localStorage.setItem('username',username);
    },
};
const actions={
    /**
     * todo：系统登录
     * @param state
     * @param commit
     * @param users
     */
    loginSystem:function ({state,commit},users) {
        http.post(url.login,users).then(response=>{
            console.log(response);
            if (response.data.code === code.SUCCESS){
                Message.success(response.data.msg);
                commit('setToken',response.data.result[0].access_token);
                commit('setUserName',response.data.result[0].username);
                router.push({path:'/admin/index'});
                return ;
            }
            Message.warning(response.data.msg);
        });
    },
    /**
     * todo：系统登出
     * @param state
     * @param commit
     * @param token
     */
    logoutSystem:function ({state,commit},token) {
        http.post(url.logout,{access_token:token}).then(response=>{
            Message.success(response.data.msg);
            commit('setToken','');
            commit('setUserName','');
            router.push({path:'/login'});
        })
    },
    /**
     * todo：保存日志
     * @param state
     * @param commit
     * @param params
     */
    saveSystemLog:function ({state,commit},params) {
        params.username = state.username;
        http.post(url.logSave,params);
    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
