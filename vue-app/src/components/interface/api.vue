<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-row>
            <el-col :span="4">
                <el-tree :props="props" @node-contextmenu="rightClick"  :highlight-current="highlight" :data="categoryLists" @node-click="getApiDetail" default-expand-all :node-key="props.id" style="width: 200px;background-color: #393d49"></el-tree>
            </el-col>

            <div v-show="menuVisible">
                <ul id="menu" class="menu">
                    <li class="menu__item" @click="addCategory">添 加</li>
                    <li class="menu__item" @click="updateCategory">修改</li>
                </ul>
            </div>

            <el-col :span="20" v-show="apiVisible">
                <el-tabs type="border-card" v-model="apiName">
                    <el-tab-pane :label="apiName" :key="apiName" :name="apiName"></el-tab-pane>
                    <el-form :label-width="labelWidth" :model="apiModel" :ref="reFrom" :rules="rules">
                        <el-form-item label="接口名称" prop="type">
                            <el-select v-model="apiModel.type"  auto-complete="true" style="width: 100%" placeholder="接口名称">
                                <el-option v-for="(category,index) in apiCategory"  :key="index" :label="setName(category)" :value="category.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="接口描述" prop="desc">
                            <el-input v-model="apiModel.desc" placeholder="接口描述"></el-input>
                        </el-form-item>
                        <el-form-item label="接口地址" prop="href">
                            <el-input v-model="apiModel.href" placeholder="接口地址"></el-input>
                        </el-form-item>
                        <el-form-item label="接口方法" prop="method">
                            <el-select v-model="apiModel.method" style="width: 100%" placeholder="接口方法">
                                <el-option v-for="(method,index) in methodLists"  :key="index" :label="method" :value="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="请求字段" prop="request">
                            <el-button type="primary" plain icon="el-icon-plus" @click="requestAdd()" size="medium"></el-button>
                            <div v-for="(request,index) in apiModel.request" :key="index">
                                <el-input v-model="request.name"  auto-complete="true" style="width: 195px;margin-bottom: 5px" placeholder="参数名"></el-input>
                                <el-select v-model="request.type"  auto-complete="true" style="width: 195px" placeholder="字段类型">
                                    <el-option v-for="(type,index) in typeLists"  :key="index" :label="type" :value="index"></el-option>
                                </el-select>
                                <el-select v-model="request.required" style="width: 195px" placeholder="是否必须">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                                <el-input v-model="request.desc" auto-complete="true" style="width: 195px" placeholder="参数描述"></el-input>
                                <el-input v-model="request.val" auto-complete="true" style="width: 195px" placeholder="参数值"></el-input>
                                <el-button type="danger" plain icon="el-icon-delete"  @click="requestRemove(request,index)" size="medium"></el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="返回参数" prop="response_string">
                            <codemirror ref="myCm"  v-model="apiModel.response_string" :options="options" style="line-height: 20px"></codemirror>
                        </el-form-item>
                        <el-form-item label="返回字段" prop="response">
                            <el-button type="primary"  plain icon="el-icon-plus" @click="responseAdd()" size="medium"></el-button>
                            <div v-for="(response,index) in apiModel.response" :key="index">
                                <el-input v-model="response.name"   auto-complete="true" style="width: 195px;margin-bottom: 5px" placeholder="参数名"></el-input>
                                <el-select v-model="response.type" auto-complete="true" style="width: 195px" placeholder="字段类型">
                                    <el-option v-for="(type,index) in typeLists"  :key="index" :label="type" :value="index"></el-option>
                                </el-select>
                                <el-input v-model="response.desc"  auto-complete="true" style="width: 200px" placeholder="参数描述"></el-input>
                                <el-button type="danger" icon="el-icon-delete" plain @click="responseRemove(response,index)" size="medium"></el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="apiModel.remark" placeholder="备注" type="textarea"></el-input>
                        </el-form-item>
                        <Submit :reFrom="reFrom" :model="apiModel" :url="url" :refs="refs" v-on:success="success" style="text-align: center"></Submit>
                    </el-form>
                </el-tabs>
            </el-col>
        </el-row>

        <!---接口分类弹框-->
        <el-dialog :title="title" :visible.sync="syncVisible" :modal="modal"  center>
            <el-form :label-width="labelWidth" :model="categoryModel" :ref="reFrom" :rules="rules">
                <el-form-item label="接口名称" prop="name">
                    <el-input v-model="categoryModel.name" placeholder="分类名称"></el-input>
                </el-form-item>
                <el-form-item label="接口上级" prop="pid">
                    <el-select placeholder="接口上级" v-model="categoryModel.pid" style="width: 100%">
                        <el-option v-for="(category,index) in apiCategory"  :key="index" :label="setName(category)" :value="category.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="接口状态" prop="status">
                    <el-radio-group v-model="categoryModel.status" size="small">
                        <el-radio-button label="0">关闭</el-radio-button>
                        <el-radio-button label="1">开启</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="categoryModel" :url="url" :refs="refs" v-on:success="success"></Submit>
            </div>
        </el-dialog>
         <!---接口分类弹框-->
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import func from '../../api/func'
    import Radio from "../common/Radio";
    import Delete from "../common/Delete";
    import Submit from "../common/Submit";
    import { codemirror } from 'vue-codemirror-lite'
    require('codemirror/lib/codemirror.css');
    require('codemirror/lib/codemirror.js');
    require('codemirror/addon/hint/show-hint.js');
    require('codemirror/addon/hint/show-hint.css');
    require('codemirror/addon/hint/javascript-hint.js');
    require('codemirror/mode/javascript/javascript.js');
    import {mapGetters,mapActions} from 'vuex'
    export default {
        name: "lists",
        components: {Submit, Delete, Radio,codemirror},
        data(){
            return {
                categoryLists:[],
                props:{
                    label:'name',
                    children:'__child',
                    id:'id'
                },
                title:'',
                syncVisible:false, //是否显示弹框
                modal:false, //遮盖层是否需要
                labelWidth:'80px',
                loading:true,
                loadingText:'玩命加载中。。。',

                url:'',
                refs:this.$refs,
                reFrom:'category',
                highlight:true,
                //接口名称
                apiName:'',

                //右键功能显示与否
                menuVisible:false,
                categoryModel:{},
                apiCategory:[],
                //代码编辑器配置
                options:{
                    mode: 'application/ld+json',
                    tabSize: 4, //缩进
                    lineNumbers: true, //行数
                    lineWrapping: false, //自动换行
                    extraKeys: {'Ctrl-Space': 'autocomplete'},
                },
                //是否展示编辑器
                apiStatus:false,
                //方法集合
                methodLists:{
                    POST:'POST',
                    GET:'GET',
                    PUT:'PUT',
                    DELETE:'DELETE',
                },
                //参数类型
                typeLists:{
                    String:'String',
                    Float:'Float',
                    Number:'Number',
                    Object:'Object',
                    Timestamp:'Timestamp'
                },
                cgi:{
                    remove:$url.remove,
                    status:$url.status,
                    insert:$url.apiSave,
                    update:$url.apiUpdate,
                    categoryInsert:$url.categorySave,
                    categoryUpdate:$url.categoryUpdate,
                },

                rules:{
                    type:[{required:true,message:'请输入权限名称', trigger: 'change'}],
                    href:[{required:true,message:'请输入权限地址', trigger: 'blur'},],
                    method:[{required:true,message:'请输入请求方法', trigger: 'change'},],
                    desc:[{required:true,message:'请输入接口描述', trigger: 'blur'},],
                    response_string:[{required:true,message:'请输入返回参数', trigger: 'blur'},],
                },
            }
        },
        computed:{
            ...mapGetters(['apiVisible','apiModel','interfaceName'])
        },
        methods:{
            ...mapActions(['addApiVisible','addApiModel']),
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.syncVisible = false;
            },
            /**
             * 设置权限名称
             * @param item
             * @return {String}
             */
            setName:function(item){
                return Array(item.level).join('　　')+item.name;
            },
            /**
             * todo：获取角色列表
             */
            getCategoryLists:function () {
                apiLists.CategoryLists({}).then(response=>{
                    if (response.data.code === 200){
                        this.apiCategory = response.data.result;
                        this.categoryLists = func.set_tree(response.data.result);
                        this.loading = false;
                    }
                });
            },
            /**
             * todo：鼠标右击触发事件
             * @param MouseEvent event 事件
             * @param object 传递给 data 属性的数组中该节点所对应的对象
             * @param Node 节点对应的 Node、
             * @param element 节点组件本身。
             */
            rightClick(MouseEvent, object, Node, element) {
                this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
                this.menuVisible = true;  // 显示模态窗口，跳出自定义菜单栏
                const menu = document.querySelector('#menu');
                document.addEventListener('click', this.foo); // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
                menu.style.left = '210px';
                menu.style.top = MouseEvent.screenY - 185 + 'px';
                this.categoryModel = object;
            },
            /**
             * todo：取消鼠标监听事件菜单栏
             */
            foo() {
                this.menuVisible = false;
                document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
            },
            /**
             * todo：添加
             */
            addCategory:function () {
                this.title='添加接口';
                this.syncVisible = true;
                this.url = this.cgi.categoryInsert;
                this.categoryModel = {
                    name:'',
                    pid:this.categoryModel.id,
                    status:'1',
                    path:'',
                    level:1
                };
                console.log(this.categoryModel);
            },
            /**
             * todo：修改
             */
            updateCategory:function () {
                this.title=this.categoryModel.name;
                this.syncVisible = true;
                this.url = this.cgi.categoryUpdate;
            },
            /**
             * 获取接口详情
             * @param data
             */
            getApiDetail:function(data){
                if (data.level<3 || data.id === 14 || data.status === '0'){
                    this.$notify({title: '通知', message: '该接口暂时不允许访问', type: 'success'});
                    return;
                }
                const obj = { 'apiVisible':true,'interfaceName':data.name };
                //设置
                this.addApiVisible(obj);
                this.apiName = this.interfaceName;
                apiLists.ApiLists( {type:data.id} ).then(response=>{
                    if (response.data.code===200){
                        this.addApiModel(response.data.result[0]);
                        this.apiModel.request = JSON.parse(this.apiModel.request);
                        this.apiModel.response = JSON.parse(this.apiModel.response);
                        this.url = this.cgi.update
                    } else {
                        this.url = this.cgi.insert;
                        let apiModel = {desc:'', type:data.id, href:'', method:'', request:[{"name":"access_token","desc":"用户token","required":"1","type":"String","val":""}],
                            response:[{"name":"code","desc":"200 成功","type":"number"},{"name":"msg","desc":"Success","type":"string"}],
                            response_string:'', remark:''};
                        this.addApiModel(apiModel);
                    }
                });
            },
            /**
             * todo：删除请求字段
             * @param item
             * @param index
             */
            requestRemove:function(item,index){
                let request=[],that = this;
                Object.keys(that.apiModel.request).forEach(function (item) {
                    request.push(that.apiModel.request[item]);
                });
                request.splice(index,1);
                that.apiModel.request = request;
            },
            /**
             * todo：动态添加表单数据
             */
            requestAdd:function(){
                this.apiModel.request.push({name:'', desc:'', required:'', type:'', val:''});
            },
            /**
             * todo：删除返回字段
             * @param item
             * @param index
             */
            responseRemove:function(item,index){
                let response=[],that = this;
                Object.keys(that.apiModel.response).forEach(function (item) {
                    response.push(that.apiModel.response[item]);
                });
                response.splice(index,1);
                that.apiModel.response = response;
            },
            /**
             * todo：动态添加表单数据
             */
            responseAdd:function(){
                this.apiModel.response.push({name:'', desc:'',  type:'' });
            }
        },
        created(){
            this.apiName = this.interfaceName;
        },
        mounted() {
            this.$nextTick(function () {
                this.getCategoryLists()
            });
        }
    }
</script>

<style scoped>

</style>