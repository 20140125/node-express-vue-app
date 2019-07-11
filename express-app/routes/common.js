const __this = require('./base'); //加载基础配置
/**
 * todo：全局删除
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/common-remove',function (request,response) {
    let params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error){throw error}
        connection.query(__this.$sql.common.delete,[params.tableName,params.id],function (error,result) {
            if (error){
                connection.rollback(function () {
                    throw error
                })
            }
            if (result){
                __this.jsonWrite(response,result);
                connection.release();
            }
        })
    })
});
/**
 * todo：全局修改状态
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/common-status',function (request,response) {
    let params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error){throw error}
        connection.query(__this.$sql.common.status,[params.tableName,params.status,params.id],function (error,result) {
            if (error){
                connection.rollback(function () {
                    throw error
                })
            }
            if (result){
                __this.jsonWrite(response,result);
                connection.release();
            }
        })
    })
});
/**
 * todo：登录系统
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/common-login',function (request,response) {
    let params = request.body;
    // noinspection SqlResolve
    let sql='select `password`,`salt`,`username`,`access_token`,`id`,`status` from `sys_user` where `username`=?';
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw error}
        connection.query(sql,[params.username],function (error,result) {
            if (error){throw error}
            if (result.length<1){
                response.code = __this.code.ERROR;response.msg = '该用户不存在，请联系管理员【'+__this.code.QQ+'】检验数据的正确性';
                __this.jsonWrite(response,[]);
                connection.release();
                return ;
            }
            if (result[0]['password'] !== __this.func.set_password(params.password,result[0]['salt'])) {
                response.code = __this.code.ERROR;
                response.msg = '密码输入错误~';
                __this.jsonWrite(response,[]);
                connection.release();
                return ;
            }
            if (result[0]['status'] === '0'){
                response.code = __this.code.FORBIDDEN;
                response.msg = '用户被禁止访问，请联系管理员【'+__this.code.QQ+'】检验数据的正确性';
                __this.jsonWrite(response,[]);
                connection.release();
                return ;
            }
            //登录成功修改access_token
            let access_token = __this.func.set_password(result[0]['password'],__this.func.get_timestamp());
            // noinspection SqlResolve
            connection.query('update `sys_user` set access_token = ? where id =?',[access_token,result[0]['id']],function (error,updateResult) {
                if (error){
                    connection.rollback(function () {throw error})
                }
                if (updateResult) {
                    result[0]['access_token'] = access_token;
                    request.session.access_token = access_token;
                    __this.jsonWrite(response,result);
                    connection.release();
                }
            });
        })
    })
});
/**
 * todo：注销登录系统
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/common-logout',function  (request,response) {
    let params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error){  throw error  }
        let access_token = __this.func.set_password(params.access_token,__this.func.get_timestamp());
        // noinspection SqlResolve
        connection.query("update `sys_user` set access_token = ? where access_token = ? ",[access_token,params.access_token],function (error,result) {
            if (error) {
                connection.rollback(function () {throw error})
            }
            if (result) {
                __this.jsonWrite(response, result);
                request.session.access_token='';
                connection.release();
            }
        });
    })
});
/**
 * todo：获取权限体系
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/common-tree',function (request,response) {
    let params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error){throw error}
        // noinspection SqlResolve
        connection.query('select `role_id` from `sys_user` where access_token=?',[params.access_token],function (error,result) {
            if (error) {throw error}
            if (result.length<1) {
                response.code = __this.code.FORBIDDEN;
                response.msg = 'access token 校验失败，用户被禁止访问！';
                __this.jsonWrite(response);
                connection.release();
                return;
            }
            //获取该角色权限
            connection.query(__this.$sql.common.select,['sys_role',result[0]['role_id']],function (error,roleResult) {
                if (error) {throw error}
                if (roleResult.length<1){
                    response.code = __this.code.ERROR;response.msg = '角色ID不存在，请联系管理员【'+__this.code.QQ+'】检验数据的正确性';
                    __this.jsonWrite(response);
                    connection.release();
                    return;
                }
                let authSql;
                //角色ID等于1，属于超级管理员，不需要排除权限
                if (result[0]['role_id'] === 1){
                    // noinspection SqlResolve
                    authSql = 'select `id`,`name`,`level`,`pid`,`url`,`status` from `sys_auth` order by `path`';
                } else {
                    // noinspection SqlResolve
                    authSql = 'select `id`,`name`,`level`,`pid`,`url`,`status` from `sys_auth` where id in (?) order by `path`';
                }
                connection.query(authSql,[JSON.parse(roleResult[0]['ids'])],function (error,authResult) {
                    if (error) {throw error}
                    if (authResult.length<1){
                        response.code = __this.code.ERROR;response.msg = '获取权限列表失败，请联系管理员【'+__this.code.QQ+'】检验数据的正确性';
                        __this.jsonWrite(response);
                        connection.release();
                        return;
                    }
                    __this.jsonWrite(response, authResult);
                    connection.release();
                })
            });
        });
    })
});
/**
 * todo：校验用户权限
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/common-check',function (request,response) {
    let params = request.body,result={};
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw error}
        // noinspection SqlResolve
        connection.query('select `access_token`,`username`,`status`,`role_id` from `sys_user` where access_token=?',[params.access_token],function (error,userResult) {
            if (error) {throw error}
            if (userResult.length<1) {
                response.code = __this.code.FORBIDDEN;
                response.msg = 'access token 校验失败，用户被禁止访问！';
                __this.jsonWrite(response);
                connection.release();
                return;
            }
            if (userResult[0]['status'] === '0'){
                response.code = __this.code.FORBIDDEN;
                response.msg = '用户被禁止访问，请联系管理员【'+__this.code.QQ+'】检验数据的正确性';
                __this.jsonWrite(response,[]);
                connection.release();
                return ;
            }
            result.user=userResult;
            connection.query(__this.$sql.common.select,['sys_role',userResult[0]['role_id']],function (error,roleResult) {
                if (error) {throw error}
                if (roleResult.length<1){
                    response.code = __this.code.FORBIDDEN;
                    response.msg = '该用户角色不存在，请联系管理员【'+__this.code.QQ+'】检验数据的正确性';
                    __this.jsonWrite(response);
                    connection.release();
                    return ;
                }
                result.auth = roleResult[0]['urls'];
                __this.jsonWrite(response, result);
                connection.release();
            });
        })
    })
});
module.exports = __this.router;
