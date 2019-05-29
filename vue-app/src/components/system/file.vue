<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-row>
            <el-col :span="4">
                <el-form :inline="true" style="margin-top: 10px">
                   <el-form-item>
                       <el-select v-model="path" @change="getFileLists">
                           <el-option v-for="(path,index) in pathLists" :key="index" :label="path" :value="path"></el-option>
                       </el-select>
                   </el-form-item>
                </el-form>
                <el-tree :data="fileLists" @node-contextmenu="rightClick" :highlight-current="highlight"  :props="props" @node-click="getFileContent" style="width: 200px;background-color: #393d49"></el-tree>
            </el-col>

            <div v-show="menuVisible">
                <ul id="menu" class="menu">
                    <li class="menu__item" @click="renameFile">重命名</li>
                    <li class="menu__item" @click="deleteFile">删除</li>
                    <li class="menu__item" @click="addFile">添加</li>
                </ul>
            </div>

            <el-col :span="20" v-show="showIdea">
                <el-form :label-width="labelWidth" :model="fileModel" :ref="reFrom" :rules="rules">
                    <el-form-item style="margin-left: -30px !important;">
                        <el-tabs type="border-card" closable v-model="activeFileTabName"  @tab-click="goto" @tab-remove="removeTabName" style="text-align: left!important;">
                            <el-tab-pane v-for="item in fileTabs" :label="item.label" :key="item.name" :name="item.name"></el-tab-pane>
                            <codemirror @change="updateContent" ref="edit" v-model="fileModel.content" :options="options" style="line-height: 20px"></codemirror>
                        </el-tabs>
                    </el-form-item>
                </el-form>
                <Submit style="text-align: center !important;" :reFrom="reFrom" :model="fileModel" :url="url" :refs="refs" v-on:success="success"></Submit>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import Submit from "../common/Submit";
    import { mapGetters,mapActions } from 'vuex';
    import { codemirror } from 'vue-codemirror-lite'
    require('codemirror/mode/javascript/javascript');
    require('codemirror/mode/vue/vue');
    require('codemirror/addon/hint/show-hint.js');
    require('codemirror/addon/hint/show-hint.css');
    require('codemirror/addon/hint/javascript-hint.js');
    require('codemirror/lib/codemirror.css');
    require('codemirror/lib/codemirror.js');
    require('codemirror/theme/3024-night.css');
    require('codemirror/addon/fold/foldgutter.css');
    require('codemirror/addon/fold/foldcode.js');
    require('codemirror/addon/fold/foldgutter.js');
    require('codemirror/addon/fold/brace-fold.js');
    require('codemirror/addon/fold/brace-fold.js');
    export default {
        name: "lists",
        components: {Submit,codemirror},
        data(){
            return {
                //树组件
                props:{
                    label:'name',
                    children:'__child',
                },

                //代码编辑器配置
                options:{
                    mode: 'text/javascript',
                    tabSize: 4, //缩进
                    lineNumbers: true, //行数
                    lineWrapping: false, //自动换行
                    extraKeys: {'Ctrl-Space': 'autocomplete'},
                    hint:true
                },
                //展示自定义右键菜单
                menuVisible:false,
                //高亮选中的节点
                highlight:true,
                //文件列表
                fileLists:[],
                //默认目录
                path:'../express-app',
                //默认显示tabs
                activeFileTabName:null,
                //目录列表 （可以配置到数据库）
                pathLists:['../express-app','../vue-app'],

                title:'default',
                syncVisible:false, //是否显示弹框
                modal:false, //遮盖层是否需要
                labelWidth:'80px',
                loading:true,
                loadingText:'玩命加载中。。。',

                url:'',
                refs:this.$refs,
                reFrom:'file',
                //文件对象
                fileObject:{},
                //文件
                fileModel:{
                    content:'',
                    path:''
                },
                //编辑器显示与否
                showIdea:true,
                cgi:{
                    remove:$url.remove,
                    update:$url.fileUpdate,
                    rename:$url.fileRename
                },
                rules:{},
            }
        },
        computed:{
            ...mapGetters(['fileTabs','currFileObj']),
        },
        methods:{
            ...mapActions(['addFileTabs','deleteFileTabs','addCurrFileObj','saveSystemLog']),
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.syncVisible = false;
            },
            /**
             * todo：获取文件列表
             * @param path
             */
            getFileLists:function (path) {
                let params = {path:path};
                apiLists.FileLists(params).then(response=>{
                    if (response.data.code === 200){
                        this.fileLists = response.data.result.filelists;
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
                this.menuVisible = false; // 关闭模态框
                this.menuVisible = true;  // 显示模态窗口，跳出自定义菜单栏
                const menu = document.querySelector('#menu');
                document.addEventListener('click', this.foo); // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
                menu.style.left = '210px';
                menu.style.top = MouseEvent.screenY - 195 + 'px';
                this.fileObject = object
            },
            /**
             * todo：取消鼠标监听事件菜单栏
             */
            foo() {
                this.menuVisible = false;
                document.removeEventListener('click', this.foo) // 关掉监听
            },
            /**
             * todo：tab切换
             * @param tab
             * @val label  tabs 标签的标题
             * @val name   tabs 标签的值
             * @val path   tabs 标签的路径
             * @val content tabs 标签下的内容
             */
            goto:function(tab){
                let item = this.fileTabs;
                for (const i in item){
                    if (item[i].label === tab.label) {
                        this.fileModel.content = item[i].content;
                        this.fileModel.path = item[i].path;
                        let currFileObj = {content:this.fileModel.content, path:this.fileModel.path, name:item[i].name};
                        this.addCurrFileObj(currFileObj);
                    }
                }
            },
            /**
             * todo：删除tabs
             * @param tabName
             * @val label  tabs 标签的标题
             * @val name   tabs 标签的值
             * @val path   tabs 标签的路径
             * @val content tabs 标签下的内容
             */
            removeTabName:function(tabName){
                this.fileTabs.forEach((tab, index) => {
                    if (tab.name === tabName) {
                        let nextTab = this.fileTabs[index + 1] || this.fileTabs[index - 1];
                        if (nextTab) {
                            this.activeFileTabName = nextTab.name;
                            this.fileModel.content = nextTab.content;
                            let currFileObj = {content:nextTab.content, path:nextTab.path, name:nextTab.name};
                            this.addCurrFileObj(currFileObj);
                            this.deleteFileTabs(tabName);
                        }
                    }
                });
            },
            /**
             * todo：获取文件内容
             * @param item
             * @val label  tabs 标签的标题
             * @val name   tabs 标签的值
             * @val path   tabs 标签的路径
             * @val content tabs 标签下的内容
             */
            getFileContent:function (item) {
                if (!item.file){
                    this.$notify({type:'success',title:'通知',message:'不是一个文件'});
                    return false;
                }
                this.showIdea = true;
                this.activeFileTabName = item.size.toString();
                let params = {path:item.path},tabs = {};
                this.url = this.cgi.update;
                tabs.label = item.name;tabs.name = item.size.toString();tabs.path = item.path;
                apiLists.FileRead(params).then(response=>{
                    if (response.data.code === 200){
                        this.fileModel.content = response.data.result.content;
                        this.fileModel.path = item.path;
                        tabs.content = this.fileModel.content;
                        this.addCurrFileObj(tabs);
                        this.addFileTabs(tabs)
                    }
                });
            },
            /**
             * todo：文件重新命名
             */
            renameFile:function(){
                let params = {old:this.fileObject.path};
                this.$prompt('请输入文件名', '重命名', { confirmButtonText: '确定', cancelButtonText: '取消',}).then(({ value }) => {
                    params.curr = params.old.replace(this.fileObject.name,value);
                    apiLists.FileRename(params).then(response=>{
                        if (response.data.code === 200){
                            this.fileObject.name = value;
                            this.$message({type: 'success', message: '你的新文件名: ' + value});
                            let data = { info:JSON.stringify({url:$url.fileSave, info:'你的新文件名: ' + value,result:response.data.result}) };
                            this.saveSystemLog(data);
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '取消输入'});
                });
            },
            /**
             * todo：文件删除
             */
            deleteFile:function(){
                this.$confirm('此操作将永远删除该条记录，是否继续？','删除记录',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    let params = {path:this.fileObject.path};
                    apiLists.FileDelete(params).then(response=>{
                       if (response.data.code === 200){
                           let data = { info:JSON.stringify({url:$url.fileDelete, info:'删除文件成功：'+params.path,result:response.data.result}) };
                           this.saveSystemLog(data);
                           this.$message({type:'success',message:'删除记录成功！：'+params.path});
                       }
                    })
                }).catch(()=>{
                    this.$message({type:'info',message:'已取消删除！'});
                });
            },
            /**
             * todo：新建文件
             */
            addFile:function () {
                let params = {};
                this.$prompt('请输入文件名', '新建文件', { confirmButtonText: '确定', cancelButtonText: '取消',}).then(({ value }) => {
                    //这是一个文件
                    if(this.fileObject.path.substring(this.fileObject.path.lastIndexOf('/')).indexOf('.')>=0){
                        params.path = this.fileObject.path.replace(this.fileObject.name,value);
                    } else {
                        params.path = this.fileObject.path+'/'+value;
                    }
                    apiLists.FileSave(params).then(response=>{
                        console.log(response);
                        if (response.data.code === 200){
                            let data = { info:JSON.stringify({url:$url.fileSave, info:'你的新文件名: ' + params.path,result:response.data.result}) };
                            this.saveSystemLog(data);
                            this.$message({type: 'success', message: '你的新文件名: ' + params.path});
                        }
                    });
                }).catch((err) => {
                    console.log(err);
                    this.$message({type: 'info', message: '取消输入'});
                });
            },
            /**
             * todo：修改编辑器内容
             * @param content
             */
            updateContent:function(content){
                this.fileModel.content = content;
            },
        },
        created(){
            this.activeFileTabName = this.currFileObj.name;
            this.fileModel = this.currFileObj;
            if (this.activeFileTabName === null){
                this.fileModel.content = '';
                this.showIdea = false; //隐藏编辑器
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.url = this.cgi.update;
                this.getFileLists(this.path);
            });
        }
    }
</script>

<style scoped>

</style>