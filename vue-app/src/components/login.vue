<template>
    <div>
        <el-dialog title="Login System" :visible.sync="syncVisible" :modal="modal"  center :show-close="modal" :close-on-click-modal="modal"
                   :close-on-press-escape="modal">
            <el-form :label-width="formWidth" :model="users" :ref="reFrom" :rules="rules">
                <el-form-item prop="username">
                    <el-input v-model="users.username" placeholder="username" autocomplete="off">
                        <template slot="prepend"><i class="el-icon-user"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="users.password" type="password" placeholder="password" autocomplete="off">
                        <template slot="prepend"><i class="el-icon-user"></i></template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm(reFrom)" plain>取 消</el-button>
                <el-button type="primary" @click="onSubmit(reFrom)" plain>确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        name: "login",
        data(){
            return {
                users:{
                    username:'',
                    password:'',
                },
                syncVisible:true,
                rules:{
                    username:[{required:true,message:'用户名必须',trigger:'blur'},],
                    password:[{required:true,message:'用户密码必须',trigger:'blur'},],
                },
                formWidth:'80px',
                loginState:'1',
                modal:false,
                reFrom:'login',
               // bgImg:require('./../assets/u0.jpg'),
            }
        },
        methods:{
            ...mapActions(['loginSystem']),
            /**
             * todo: 用户登录
             * @param formName
             */
            onSubmit:function (formName) {
                this.$refs[formName].validate((valid)=>{
                    if (valid){
                        this.loginSystem(this.users);
                    }
                })
            },
            /**
             * todo：表单重置
             * @param formName
             */
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        mounted() {

        }
    }
</script>
<style scoped>

</style>
