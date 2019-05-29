<template>
    <div class="layui-layout layui-layout-admin">
        <div class="layui-header">
            <div class="layui-logo">layui 后台布局</div>
            <ul class="layui-nav layui-layout-left">
                <li class="layui-nav-item" @click="hideMenu(isCollapse)"><i class="layui-icon layui-icon-shrink-right layui-slide-menu" style="font-size: 30px;cursor: pointer;color: #009688;"></i></li>
                <li class="layui-nav-item"><a href="">控制台</a></li>
                <li class="layui-nav-item"><a href="">商品管理</a></li>
                <li class="layui-nav-item"><a href="">用户</a></li>
                <li class="layui-nav-item">
                    <a href="javascript:void(0);">其它系统</a>
                    <dl class="layui-nav-child">
                        <dd><a href="">邮件管理</a></dd>
                        <dd><a href="">消息管理</a></dd>
                        <dd><a href="">授权管理</a></dd>
                    </dl>
                </li>
            </ul>

            <ul class="layui-nav layui-layout-right">
                <li class="layui-nav-item">
                    <a href="javascript:void(0);">
                        <img src="https://www.fanglonger.com/image/logo.jpg" class="layui-nav-img" alt=""> {{username}}
                    </a>
                    <dl class="layui-nav-child">
                        <dd><a href="">基本资料</a></dd>
                        <dd><a href="">安全设置</a></dd>
                        <dd><a href="javascript:void(0)" @click="logout()">退出登陆</a></dd>
                    </dl>
                </li>
            </ul>
        </div>


        <div class="layui-side layui-bg-black" id="left_box_admin">
            <el-menu background-color="#393D49" text-color="#fff" unique-opened :collapse="isCollapse">
                <el-submenu v-for="(menu,index) in menuLists" :key="index" :index="menu.id.toString()">
                    <template slot="title">
                        <i class="layui-icon layui-icon-app" style="float: left" v-if="menu.id!==2"> </i>
                        <span v-html="menu.name"></span>
                    </template>
                    <el-menu-item :index="child.id.toString()"  v-for="(child,index) in menu.__child" @click="setAttr(child)" :key="index" style="width: 190px" >
                        <router-link :to="child.url" v-html="child.name" style="color: #fff;"></router-link>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </div>

        <div class="layui-body" id="right_box_admin">
            <!-- 内容主体区域 -->
            <div style="padding: 10px;">
                <el-tabs type="border-card" closable  v-model="activeName" @tab-click="goto" @tab-remove="remove" style="text-align: left!important;" v-show="contentVisible">
                    <el-tab-pane v-for="item in tabs" :label="item.label" :key="item.name" :name="item.name"></el-tab-pane>
                    <router-view></router-view>
                </el-tabs>
            </div>
        </div>
        <div class="layui-footer" id="footer_box_main">
            <!-- 底部固定区域 -->
            © layui.com - 底部固定区域
        </div>
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    import func from '../../api/func'
    import { mapGetters,mapActions } from 'vuex';
    export default {
        name: "baseModule",
        data(){
            return {
                isCollapse:false,
                menuLists:[],
                activeName:null
            }
        },
        computed:{
            ...mapGetters(['tabs','token','username','activeAuthName','contentVisible']),
        },
        methods:{
            ...mapActions(['addTabs','deleteTabs','addCurrTabs']),
            /**
             * todo：获取权限菜单
             * @param token
             */
            getMenu:function(token){
                apiLists.AuthTree({access_token:token}).then(response=>{
                    for (let i in response.data.result){
                        if (response.data.result[i].status === '1'){
                            this.menuLists.push(response.data.result[i]);
                        }
                    }
                    this.menuLists = func.set_tree(this.menuLists,1);
                })
            },
            /**
             * todo：设置tabs
             * @param item
             */
            setAttr:function(item){
                let params = {label:item.name,name:item.url};
                this.activeName = params.name;
                this.addCurrTabs(params);
                this.addTabs(params)
            },
            /**
             * todo：路由追加
             * @param tab
             */
            goto:function(tab){
                this.$router.push({path:tab.name});
            },
            /**
             * todo：删除tabs
             * @param tabName
             */
            remove:function(tabName){
                this.tabs.forEach((tab, index) => {
                    if (tab.name === tabName) {
                        let nextTab = this.tabs[index + 1] || this.tabs[index - 1];
                        if (nextTab) {
                            this.deleteTabs(tabName);
                            this.activeName = nextTab.name;
                            this.addCurrTabs(nextTab);
                        }
                    }
                });
            },
            /**
             * todo：隐藏侧边栏
             * @param index
             */
            hideMenu:function(index){
                this.isCollapse=!index;
                let leftBoxMain = $('#left_box_admin'),layuiSlideMenu = $(".layui-slide-menu") ;
                if(leftBoxMain.width() === 200) {
                    $('#right_box_admin').animate({
                        left: '64px',
                    });
                    $("#footer_box_main").animate({
                        left: '64px',
                    });
                    leftBoxMain.animate({
                        width: '64px',
                    });
                    layuiSlideMenu.removeClass('layui-icon-shrink-right');
                    layuiSlideMenu.addClass('layui-icon-spread-left')
                } else {
                    $('#right_box_admin').animate({
                        left: '200px',
                    });
                    $("#footer_box_main").animate({
                        left :'200px',
                    });
                    leftBoxMain.animate({
                        width: '200px',
                    });
                    layuiSlideMenu.removeClass('layui-icon-spread-left');
                    layuiSlideMenu.addClass('layui-icon-shrink-right');
                }
            },
        },
        created(){
            this.activeName = this.activeAuthName;
        },
        mounted() {
            this.$nextTick(function () {
                this.getMenu(this.token);
            });
        }
    }
</script>
<style scoped>
</style>
