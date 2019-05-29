<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addUser">添 加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="userLists" border>
            <el-table-column label="#" prop="id"></el-table-column>
            <el-table-column label="管理员" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email" ></el-table-column>
            <el-table-column label="手机号" prop="phone_number" ></el-table-column>
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
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateUser(scope.row)">修 改</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="userLists"></Delete>
                </template>
            </el-table-column>
        </el-table>
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
            <el-form :label-width="labelWidth" :model="userModel" :ref="reFrom" :rules="rules">
                <el-form-item label="管理员" prop="username">
                    <el-input v-model="userModel.username" placeholder="管理员名称"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="userModel.password" type="password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userModel.email" type="email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone_number" v-if="userModel.id">
                    <el-input v-model="userModel.phone_number" type="email" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role_id">
                    <el-select v-model="userModel.role_id" style="width: 100%">
                        <el-option v-for="(role,index) in roleLists" :key="index" :label="role.role_name" :value="role.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示状态" prop="status">
                    <el-radio-group  v-model="userModel.status" size="small">
                        <el-radio-button label="0">关闭</el-radio-button>
                        <el-radio-button label="1">开启</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="userModel" :url="url" :refs="refs" v-on:success="success"></Submit>
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
                userLists:[],
                roleLists:[],
                page:1,
                limit:15,
                total:0,

                title:'',
                syncVisible:false, //是否显示弹框
                modal:false, //遮盖层是否需要
                labelWidth:'80px',
                loading:true,
                loadingText:'玩命加载中。。。',

                url:'',
                refs:this.$refs,
                reFrom:'user',

                userModel:{
                    username:'',
                    email:'',
                    password:'',
                    salt:func.set_random(),
                    status:'0',
                    role_id:'',
                    phone_number:'',
                    created_at:func.get_timestamp(),
                    updated_at:func.get_timestamp(),
                    access_token:''
                },
                cgi:{
                    insert:$url.userSave,
                    update:$url.userUpdate,
                    remove:$url.remove,
                    status:$url.status
                },
                rules:{
                    username:[{required:true,message:'管理员名称不得为空',trigger:'blur'}],
                    password:[{required:true,message:'密码不得为空',trigger:'blur'}],
                    email:[{required:true,message:'邮箱不得为空',trigger:'blur'},{type:'email',message:'邮箱格式不正确',trigger:'blur'}],
                    phone_number:[{required:true,message:'手机号不得为空',trigger:'blur'}],
                    role_id:[{required:true,message:'角色不得为空',trigger:'change'}]
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
            getUserLists:function (page,limit) {
                let params = { offset:limit*(page-1), limit:limit,level:'1'};
                apiLists.UserLists(params).then(response=>{
                    if (response.data.code===200){
                        this.userLists = response.data.result.user;
                        this.total = response.data.result.total;
                        this.roleLists = response.data.result.role;
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
                this.getUserLists(this.page,this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange:function(val){
                this.page = val;
                this.getUserLists(this.page,this.limit)
            },
            /**
             * todo：添加管理员
             */
            addUser:function () {
                this.title='添加管理员';
                this.syncVisible = true;
                this.url = this.cgi.insert;
            },
            /**
             * todo：修改管理员
             * @param item
             */
            updateUser:function (item) {
                this.title='修改管理员';
                this.syncVisible = true;
                this.userModel = item;
                this.url = this.cgi.update;
                this.userModel.updated_at = func.get_timestamp();
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getUserLists(this.page,this.limit);
            });
        }
    }
</script>

<style scoped>

</style>