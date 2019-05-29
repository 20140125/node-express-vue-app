import axios from 'axios/index'
import store from '../store'
import router from '../router'
import func from './func'
import {Message} from "element-ui";

/**
 * todo：请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param other
 */
const errorHandle = (status,other) => {
    // 状态码判断
    switch (status) {
        // 401: 未登录状态，跳转登录页
        case 401:
            router.push({path:'/login'});
            localStorage.clear();
            Message.warning(other.statusText);
            break;
            // 清除token并跳转登录页
        case 403:
            router.push({path:'/login'});
            localStorage.clear();
            Message.warning(other.statusText);
            break;
            // 404请求不存在
        case 404:
            Message.warning(other.statusText);
            break;
            //网络错误
        case 504:
            Message.warning(other.statusText);
            break;
        default:
            console.log(other);
            break;
    }
};
const instance = axios.create({ timeout:5000,data:{access_token:store.state.login.token} });
// http request 拦截器
instance.interceptors.request.use(config=>{
    if (store.state.login.token){
        config.headers.Authorization = `${func.set_password(func.set_random(32),func.set_random(12))}-${store.state.login.token}-${func.set_password(func.set_random(32),func.set_random(12))}`
    }
    return config
},error=>{
    return Promise.reject(error);
});
// http response 拦截器
instance.interceptors.response.use(response=>{
    return response
},error=>{
    console.log(error.response);
    errorHandle(error.response.status,error.response);
});
export default instance;