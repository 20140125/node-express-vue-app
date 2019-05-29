<template>
    <div>
        <el-radio-group v-model="item.status" size="mini" @change="setStatus(item)">
            <el-radio-button label="0">关闭</el-radio-button>
            <el-radio-button label="1">开启</el-radio-button>
        </el-radio-group>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: "Radio",
        props:{
            item:Object,
            url:String,
        },
        data(){
            return {
                table:this.$route.meta.mode,
            }
        },
        methods:{
            ...mapActions(['saveSystemLog']),
            /**
             * todo：修改状态
             * @param item
             */
            setStatus:function (item) {
                let params = {tableName:'sys_'+this.table,status:item.status,id:item.id};
                if (this.$store.state.login.auth_url.indexOf(this.url.replace('-','/').replace('api','admin'))===-1){
                    let info ='你没有访问权限，请联系管理员【'+this.$code.QQ+'】检验数据的正确性', data = { info:JSON.stringify({url:this.url, info:info}) };
                    this.saveSystemLog(data);
                    this.$alert(info,{callback:action=>{
                            location.href='tencent://message/?uin='+this.$code.QQ+'&Site=后台权限认证&Menu=yes';
                        }
                    });
                    item.status = params.status==='1'?'0':'1';
                    return ;
                }
                this.$http.post(this.url,params).then(response=>{
                    let data = { info:JSON.stringify({url:this.url, info:'修改数据成功',result:response.data.result}) };
                    this.saveSystemLog(data);
                    this.$message({type:'success',message:'修改成功'});
                    console.log(response);
                },error=>{
                    item.status = params.status==='1'?'0':'1';
                    console.log(error);
                })
            }
        }
    }
</script>

<style scoped>

</style>