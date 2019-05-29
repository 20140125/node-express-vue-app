<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addAuth">添 加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="roleLists" border>
            <el-table-column label="#" prop="id"></el-table-column>
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
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateAuth(scope.row)">修 改</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="roleLists"></Delete>
                </template>
            </el-table-column>
        </el-table>
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
                reFrom:'role',

                roleModel:{},

                cgi:{
                    remove:$url.remove,
                    status:$url.status
                },
                rules:{},
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
                let params = { offset:limit*(page-1), limit:limit };
                apiLists.RoleLists(params).then(response=>{
                    console.log(response);
                });
                this.loading = false;
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
             * todo：添加
             */
            addAuth:function () {
                this.title='添加';
                this.syncVisible = true;
                this.url = this.cgi.insert;
            },
            /**
             * todo：修改
             * @param item
             */
            updateAuth:function (item) {
                this.title='修改';
                this.syncVisible = true;
                this.roleModel = item;
                this.url = this.cgi.update;
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