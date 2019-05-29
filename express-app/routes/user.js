const __this = require('./base'); //加载基础配置

/**
 * todo：获取管理员列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/user-lists',(request,response)=>{
    let params = request.body,result = {};
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw error}
        //管理员列表
        connection.query(__this.$sql.users.select,[params.offset,params.limit],function (error,userResult) {
            if (error) { throw error }
            if (userResult){
                result.user = userResult;
                //总记录数
                connection.query(__this.$sql.common.total,['sys_user'],function (error,totalResult) {
                    if (error) { throw error }
                    if (totalResult){
                        result.total = totalResult[0]['total'];
                        //用户角色
                        connection.query(__this.$sql.role.selectAll,[params.level],function (error,roleResult) {
                            if (error) { throw error }
                            if (roleResult){
                                result.role = roleResult;
                                __this.jsonWrite(response,result);
                                connection.release(); //资源释放
                            }
                        });
                    }
                })
            }
        })
    })
});

/**
 * todo：保存管理员列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/user-save',(request,response)=>{
    let params = request.body;
    params.password = __this.func.set_password(params.password,params.salt);
    params.access_token = __this.func.set_password(params.password,params.created_at.toString());
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw error}
        connection.query(__this.$sql.users.add,[params.username,params.email,params.password,params.salt,params.access_token,params.role_id,params.created_at,params.updated_at,params.status],function (error,result) {
            if (error) {
                connection.rollback(function () {throw error})
            }
            if (result.length<1){
                response.code = __this.code.ERROR;
                response.msg = error;
                __this.jsonWrite(response);
                connection.release(); //释放资源链接
                return;
            }
            __this.jsonWrite(response,result);
            connection.release(); //资源释放
        })
    })
});
/**
 * todo：更新管理员列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/user-update',(request,response)=>{
    let params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw error}
        connection.query(__this.$sql.common.select,['sys_user',params.id],function (error,userResult) {
            if (error) {throw error}
            if (userResult.length<1){
                response.code = __this.code.ERROR;
                response.msg = error;
                __this.jsonWrite(response);
                connection.release(); //释放资源链接
                return;
            }
            if (userResult && userResult.password !== params.password){
                params.password  = __this.func.set_password(params.password,params.salt);
            }
        });
        connection.query(__this.$sql.users.update,[params.username,params.email,params.password,params.salt,params.access_token,params.role_id,params.updated_at,params.status,params.phone_number,params.id],function (error,result) {
            if (error) {
                connection.rollback(function () {throw error})
            }
            if (result.length<1){
                response.code = __this.code.ERROR;
                response.msg = error;
                __this.jsonWrite(response);
                connection.release(); //释放资源链接
                return;
            }
            __this.jsonWrite(response,result);
            connection.release(); //资源释放
        })
    })
});
module.exports = __this.router;