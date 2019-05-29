<template>
    <el-button plain type="danger" icon="el-icon-delete" size="mini" @click="remove(item,index)">删 除</el-button>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        name: "Delete",
        props:{
            item:Object,
            url:String,
            index:Number,
            Lists:Array,
        },
        data(){
            return {
                table:this.$route.meta.mode,
            }
        },
        methods:{
            ...mapActions(['saveSystemLog']),
            /**
             * todo：删除记录
             * @param item
             * @param index
             */
            remove:function (item,index) {
                if (this.$store.state.login.auth_url.indexOf(this.url.replace('-','/').replace('api','admin'))===-1){
                    let info ='你没有访问权限，请联系管理员【'+this.$code.QQ+'】检验数据的正确性', data = { info:JSON.stringify({url:this.url, info:info}) };
                    this.saveSystemLog(data);
                    this.$alert(info,{callback:action=>{
                            location.href='tencent://message/?uin='+this.$code.QQ+'&Site=后台权限认证&Menu=yes';
                        }
                    });
                    return ;
                }
                this.$confirm('此操作将永远删除该条记录，是否继续？','删除记录',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    let params = {tableName:'sys_'+this.table,id:item.id};
                    this.$http.post(this.url,params).then(response=>{
                        console.log(response);
                        this.Lists.splice(index,1);
                        let data = { info:JSON.stringify({url:this.url, info:'删除记录成功',result:response.data.result}) };
                        this.saveSystemLog(data);
                        this.$message({type:'success',message:'删除记录成功！'});
                    },error=>{
                        console.log(error);
                    })
                }).catch(()=>{
                    this.$message({type:'info',message:'已取消删除！'});
                })

            }
        }
    }
</script>

<style scoped>

</style>