import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Login from '@/components/login'
import AuthLists from '@/components/auth/lists'
import RoleLists from '@/components/role/lists'
import UserLists from '@/components/user/lists'
import SystemLog from '@/components/system/log'
import SystemFile from '@/components/system/file'
import ApiLists from '@/components/interface/api'

Vue.use(Router);

export default new Router({
    // mode:'history',
    routes: [
        { path: '/login', name: 'Login', component: Login,meta:{ mode:'',title:'登录' } },
        { path: '/admin', name: 'Index', component: Index,meta:{ mode:'',title:'首页' } },
        { path:'/admin',component: Index,
            children:[
                { path: 'auth/lists', name:'AuthLists',component:AuthLists,meta:{ mode:'auth',title:'权限列表' } },
                { path: 'role/lists', name:'RoleLists',component:RoleLists,meta:{ mode:'role',title:'角色列表' } },
                { path: 'user/lists', name:'UserLists',component:UserLists,meta:{ mode:'user',title:'管理员列表' } },
                { path: 'log/lists',  name:'SystemLog',component:SystemLog,meta:{ mode:'log',title:'日志列表' } },
                { path: 'file/lists',  name:'SystemFile',component:SystemFile,meta:{ mode:'file',title:'文件列表' } },
                { path: 'interface/lists', name:'ApiLists',component:ApiLists,meta:{ mode:'api_lists',title:'接口详情' } },
            ]
        },
    ]
})
