<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item>
                <el-select v-model="pid" placeholder="选择权限" @change="searchAuth">
                    <el-option v-for="(item,index) in authLevel" :key="index" :label="setAuthName(item)" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="name" placeholder="权限名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button plain icon="el-icon-search" size="medium"  type="primary" @click="searchAuth">搜 索</el-button>
                <el-button plain type="primary" size="medium"  @click="reset">重 置</el-button>
            </el-form-item>
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addAuth">添 加</el-button>
            </el-form-item>
        </el-form>
        <!--table 表格-->
        <el-table :data="authLists" border>
            <el-table-column label="#" prop="id"></el-table-column>
            <el-table-column label="权限名称">
                <template slot-scope="scope">
                    {{setAuthName(scope.row)}}
                </template>
            </el-table-column>
            <el-table-column label="权限链接" prop="url"></el-table-column>
            <el-table-column label="显示状态">
                <template slot-scope="scope">
                    <Radio :item="scope.row" :url="cgi.status"></Radio>
                </template>
            </el-table-column>
            <el-table-column prop="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateAuth(scope.row)">修 改</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="authLists"></Delete>
                </template>
            </el-table-column>
        </el-table>
        <!--table 表格-->
        <!--table 分页-->
        <div style="margin: 25px 0">
            <el-pagination
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    :page-sizes="[15, 30, 50, 100]"
                    :page-size="limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :current-page="page">
            </el-pagination>
        </div>
        <!--table 分页-->
        <!---弹框-->
        <el-dialog :title="title" :visible.sync="syncVisible" :modal="modal"  center>
            <el-form :label-width="labelWidth" :model="authModel" :ref="reFrom" :rules="rules">
                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="authModel.name" placeholder="权限名称"></el-input>
                </el-form-item>
                <el-form-item label="权限链接" prop="url">
                    <el-input v-model="authModel.url" placeholder="/api/auth/lists"></el-input>
                </el-form-item>
                <el-form-item label="权限上级" prop="pid">
                   <el-select placeholder="权限上级" style="width: 100%" v-model="authModel.pid">
                       <el-option v-for="(item,index) in authLevel" :key="index" :label="setAuthName(item)" :value="item.id"></el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label="权限状态" prop="status">
                    <el-radio-group v-model="authModel.status" size="small">
                        <el-radio-button label="0">关闭</el-radio-button>
                        <el-radio-button label="1">开启</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="authModel" :url="url" :refs="refs"  v-on:success="success"></Submit>
            </div>
        </el-dialog>
        <!---弹框-->
    </div>
</template>

<script>
    import Submit from "../common/Submit";
    import Radio from "../common/Radio";
    import Delete from "../common/Delete";
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    export default {
        name: "lists",
        components: {Delete, Radio, Submit},
        data(){
            return {
                authLists:[],
                page:1,
                limit:15,
                total:0,
                pid:'',
                name:'',
                title:'',
                syncVisible:false, //是否显示弹框
                modal:false, //遮盖层是否需要
                labelWidth:'80px',
                authLevel:[],
                loading:true,
                loadingText:'玩命加载中。。。',

                url:'',
                refs:this.$refs,
                reFrom:'auth',

                //权限默认数据
                authModel:{
                    name:'',
                    url:'',
                    status:'0',
                    pid:1,
                    level:0,
                    path:''
                },

                //URL
                cgi:{
                    insert:$url.authSave,
                    update:$url.authUpdate,
                    remove:$url.remove,
                    status:$url.status,
                },

                //表单验证规则
                rules:{
                    name:[ { required:true,message:'权限名称不得为空',trigger:'blur' } ],
                    url:[ { required:true,message:'权限链接不得为空',trigger:'blur' } ],
                    pid:[ { required:true,message:'权限上级不得为空',trigger:'change' } ],
                    status:[ { required:true,message:'权限状态不得为空',trigger:'change' } ]
                }
            }
        },
        methods:{
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.syncVisible = false;
            },
            /**
             * todo：获取权限
             * @param page
             * @param limit
             */
            getAuthLists:function (page,limit) {
                let params = { pid:this.pid,name:this.name,offset:limit*(page-1), limit:limit,level: 3 };
                apiLists.AuthLists(params).then(response=>{
                    if (response.data.code===200){
                        this.authLists = response.data.result.auth;
                        this.authLevel = response.data.result.level;
                        this.total = response.data.result.total;
                        this.loading = false;
                    }
                });
            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange:function(val){
                this.limit = val;
                this.getAuthLists(this.page,this.limit);
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange:function(val){
                this.page = val;
                this.getAuthLists(this.page,this.limit);
            },
            /**
             * todo：权限检索
             */
            searchAuth:function(){
                this.getAuthLists(this.page,this.limit);
            },
            /**
             * todo：重置搜索条件
             */
            reset:function(){
                this.pid = '';
                this.name = '';
                this.getAuthLists(this.page,this.limit);
            },
            /**
             * 设置权限名称
             * @param item
             * @return {String}
             */
            setAuthName:function(item){
                return Array(item.level).join('　　')+item.name;
            },
            /**
             * todo：权限添加
             */
            addAuth:function () {
                this.syncVisible = true;
                this.title = '添加权限';
                this.url = this.cgi.insert;
            },
            /**
             * todo：权限保存
             * @param item
             */
            updateAuth:function (item) {
                this.syncVisible = true;
                this.title = '修改权限';
                this.url = this.cgi.update;
                this.authModel = item;
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getAuthLists(this.page,this.limit);
            });
        }
    }
</script>

<style scoped>

</style>