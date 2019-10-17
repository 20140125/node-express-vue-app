<template>
    <div>
        <el-button @click="resetForm(reFrom)" plain>取 消</el-button>
        <el-button type="primary" @click="submitForm(reFrom)" plain>确 定</el-button>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: "Submit",
        props:{
            reFrom:String,
            model:Object,
            url:String,
            refs:Object
        },
        data(){
            return {

            }
        },
        methods:{
            ...mapActions(['saveSystemLog']),
            submitForm:function(ref){
                if (this.$store.state.login.auth_url.indexOf(this.url.replace('-','/').replace('api','admin'))===-1 && this.$store.state.login.username !== 'admin'){
                    let info ='你没有访问权限，请联系管理员【'+this.code.QQ+'】检验数据的正确性', data = { info:JSON.stringify({url:this.url, info:info}) };
                    this.saveSystemLog(data);
                    this.$alert(info,{callback:action=>{
                            location.href='tencent://message/?uin='+this.code.QQ+'&Site=后台权限认证&Menu=yes';
                        }
                    });
                    return ;
                }
                this.refs[ref].validate((valid)=>{
                    if (valid){
                        this.$http.post(this.url,this.model).then(response=>{
                            let data = { info:JSON.stringify({url:this.url, info:'保存数据成功',result:response.data.result}) };
                            this.saveSystemLog(data);
                            if (response.data.code === 200){
                                this.$message({type:'success',message:'保存成功'});
                                this.$emit('success');
                            }
                        },error=>{
                            console.log(error);
                        });
                        return true;
                    }
                    this.$message({type:'warning',message:'请检查字段完整性~'});
                });
            },
            resetForm:function (ref) {
                this.refs[ref].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
