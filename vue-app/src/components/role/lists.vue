<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="mini" plain @click="addRole">添 加</el-button>
            </el-form-item>
        </el-form>
        <!--table 表格-->
        <el-table :data="roleLists" border>
            <el-table-column label="#" prop='id' sortable></el-table-column>
            <el-table-column label="角色名称" prop="role_name" ></el-table-column>
            <el-table-column label="显示状态">
                <template slot-scope="scope">
                    <Radio :item="scope.row" :url="cgi.status"></Radio>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" sortable>
                <template slot-scope="scope">
                    {{setTimes(scope.row.created_at)}}
                </template>
            </el-table-column>
            <el-table-column label="修改时间" sortable>
                <template slot-scope="scope">
                    {{setTimes(scope.row.updated_at)}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateRole(scope.row)">修 改</el-button>
                    <Delete :url="cgi.delete" :item="scope.row" :index="scope.$index" :Lists="roleLists"></Delete>
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
            <el-form :label-width="labelWidth" :model="roleModel" :ref="reFrom" :rules="rules">
                <el-form-item label="角色名称" prop="role_name">
                    <el-input v-model="roleModel.role_name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="权限列表" prop="ids">
                    <el-tree :props="props" :data="auth" default-expand-all @check-change="handleCheckChange" show-checkbox :node-key="props.id"  :default-checked-keys="defaultChecked"></el-tree>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="roleModel.status" size="small">
                        <el-radio-button label="0">关闭</el-radio-button>
                        <el-radio-button label="1">开启</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="roleModel" :url="url" :refs="refs" v-on:success="success"></Submit>
            </div>
        </el-dialog>
        <!---弹框-->
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import func from '../../api/func'
    import Radio from "../common/Radio";
    import Delete from "../common/Delete";
    import Submit from "../common/Submit";
    export default {
        name: "lists",
        components: {Submit, Delete, Radio},
        data(){
            return {
                props:{
                    label:'name',
                    children:'__child',
                    id:'id',
                },
                roleLists:[],
                page:1,
                limit:15,
                total:0,
                loading:true,
                loadingText:'玩命加载中。。。',
                auth:[],
                defaultChecked:[],

                title:'',
                syncVisible:false, //是否显示弹框
                modal:false, //遮盖层是否需要
                labelWidth:'80px',

                url:'',
                refs:this.$refs,
                reFrom:'role',

                roleModel:{
                    role_name:'',
                    ids:[],
                    urls:[],
                    status:'0',
                    created_at:func.get_timestamp(),
                    updated_at:func.get_timestamp()
                },

                ids:[1],
                urls:['/admin'],

                cgi:{
                    insert:$url.roleSave,
                    update:$url.roleUpdate,
                    remove:$url.remove,
                    status:$url.status
                },
                rules:{
                    role_name:[{ required:true,message:'角色名称不得为空',trigger:'blur' }],
                    ids:[{ required:true,message:'权限ID不得为空',trigger:'blur' }],
                    urls:[{ required:true,message:'权限地址不得为空',trigger:'blur' }]
                },
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
             * todo：设置时间
             * @param timestamp
             */
            setTimes:function(timestamp){
                return func.set_time(timestamp*1000);
            },
            /**
             * todo：获取角色列表
             * @param page
             * @param limit
             */
            getRoleLists:function (page,limit) {
                let params = { offset:limit*(page-1), limit:limit,level:4 };
                apiLists.RoleLists(params).then(response=>{
                    if (response.data.code===200){
                        this.roleLists = response.data.result.role;
                        this.total = response.data.result.total;
                        this.auth = func.set_tree(response.data.result.auth);
                        this.loading = false;
                    }
                })
            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange:function(val){
                this.limit = val;
                this.getRoleLists(this.page,this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange:function(val){
                this.page = val;
                this.getRoleLists(this.page,this.limit)
            },
            /**
             * todo：角色添加
             */
            addRole:function () {
                this.title='添加角色';
                this.syncVisible = true;
                this.url = this.cgi.insert;
            },
            /**
             * todo：获取选中的节点
             * @param data  该节点所对应的对象
             * @param checked 节点本身是否被选中
             * @param indeterminate 节点的子树中是否有被选中的节点
             */
            handleCheckChange:function(data, checked, indeterminate) {
                if ((checked || indeterminate) && this.ids.indexOf(data.id)<=-1){
                    this.ids.push(data.id);
                    this.urls.push(data.auth_url)
                }else if (!checked && !indeterminate && this.ids.indexOf(data.id)>=1 ){
                    this.ids.splice(this.ids.indexOf(data.id),1);
                    this.urls.splice(this.urls.indexOf(data.auth_url),1)
                }
                for (let i in this.ids){
                    if (this.ids[i] === 1){
                        this.ids.splice(i,1);
                    }
                }
                for (let j in this.urls){
                    if (this.urls[j] === '0'){
                        this.urls.splice(j,1);
                    }
                }
                this.roleModel.ids = JSON.stringify(this.ids);
                this.roleModel.urls = JSON.stringify(this.urls);
            },
            /**
             * todo：更新角色
             * @param item
             */
            updateRole:function (item) {
                this.syncVisible = true;
                this.title = '修改角色';
                this.url = this.cgi.update;
                this.ids = JSON.parse(item.ids);
                this.urls = JSON.parse(item.urls);
                this.defaultChecked = JSON.parse(item.ids);
                this.roleModel = item;
                this.roleModel.updated_at = func.get_timestamp();
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getRoleLists(this.page,this.limit)
            });
        }
    }
</script>

<style scoped>

</style>