const __this = require('./base'); //加载基础配置

/**
 * todo：获取权限列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/role-lists',(request,response)=>{
    let params = request.body,result = {};
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw error}
        connection.query(__this.$sql.role.select,[params.offset,params.limit],function (error,roleResult) {
            if (error) { throw error }
            if (roleResult){
                result.role = roleResult;
                connection.query(__this.$sql.common.total,['sys_role'],function (error,totalResult) {
                    if (error) { throw error }
                    if (totalResult){
                        result.total = totalResult[0]['total'];
                       connection.query(__this.$sql.auth.select,[params.level],function (error,authResult) {
                           if (error){ throw error }
                           if (authResult){
                               result.auth = authResult;
                               __this.jsonWrite(response,result);
                               connection.release(); //资源释放
                           }
                       })
                    }
                })
            }
        })
    })
});

/**
 * todo：保存角色列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/role-save',(request,response)=>{
    let params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw error}
        connection.query(__this.$sql.role.add,[params.role_name,params.urls,params.ids,params.status,params.created_at,params.updated_at],function (error,result) {
            if (error) {
                connection.rollback(function () {
                    throw error
                })
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
 * todo：更新角色列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/role-update',(request,response)=>{
    let params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw error}
        connection.query(__this.$sql.role.update,[params.role_name,params.urls,params.ids,params.status,params.updated_at,params.id],function (error,result) {
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