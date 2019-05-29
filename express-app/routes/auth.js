const __this = require('./base');  //加载基础配置
/**
 * todo：搜索权限列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/auth-lists',(request,response)=>{
    let params = request.body;
    // noinspection SqlResolve
    let sql = "select * from `sys_auth` where `id`>1 ";
    // noinspection SqlResolve
    let total = 'select count(*) as total from `sys_auth` where `id`>=1';
    if (params.pid!==''){
        sql+=" and (pid = "+__this.mysql.escape(params.pid)+" or id = "+__this.mysql.escape(params.pid)+" )";
        total+=" and (pid = "+__this.mysql.escape(params.pid)+" or id = "+__this.mysql.escape(params.pid)+" )";
    }
    if (params.name!==''){
        sql+=" and name like "+__this.mysql.escape('%'+params.name+'%');
        total+=" and name like "+__this.mysql.escape('%'+params.name+'%');
    }
    sql+=" order by path asc limit ?,? ";
    total+=" limit 1 ";
    let result = {};
    __this.pool.getConnection(function (error,connection) {
        if (error){ throw Error(error); }
        connection.query(sql,[params.offset,params.limit],function (error,authResult) {
            if (error) { throw error }
            if (authResult) {
                result.auth = authResult;
                connection.query(__this.$sql.auth.select,[params.level],function (error,levelResult) {
                    if (error) { throw error }
                    if (levelResult){
                        result.level = levelResult;
                        //获取总数量
                        connection.query(total,['sys_auth'],function (error,totalResult) {
                            if (error) { throw error }
                            if (totalResult){
                                result.total = totalResult[0]['total'];
                                __this.jsonWrite(response,result);
                                connection.release();  // 释放连接
                            }
                        });
                    }
                });
            }
        })
    })
});
/**
 * todo：保存权限列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/auth-save',(request,response)=>{
    let params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error){throw Error(error);}
        //插入权限
        connection.query(__this.$sql.auth.add,[params.name,params.url,params.status,params.pid,params.level,params.path], function (error,insertResult) {
            if (error){
                connection.rollback(function() {throw Error(error)}); //如果失败回滚
            }
            if (insertResult){
                //获取权限上级
                connection.query(__this.$sql.common.select,['sys_auth',__this.mysql.escape(params.pid)],function (error,selectResult) {
                    if (error) { throw error }
                    params.path =insertResult.insertId;
                    params.level = 1;
                    if (selectResult.length<1){
                        response.code = __this.code.ERROR;
                        response.msg = error;
                        __this.jsonWrite(response);
                        connection.release(); //释放资源链接
                        return;
                    }
                    params.path = selectResult[0]['path']+','+insertResult.insertId;
                    params.level = eval(__this.func.str_count(params.path,',')+1);
                    connection.query(__this.$sql.auth.update, [params.name,params.url,params.status,params.pid,params.level,params.path,insertResult.insertId], function (error,updateResult) {
                        if (error){
                            connection.rollback(function() {throw Error(error)});  //如果失败回滚
                        }
                        if (updateResult.length<1){
                            response.code = __this.code.ERROR;
                            response.msg = error;
                            __this.jsonWrite(response);
                            connection.release(); //释放资源链接
                            return;
                        }
                        __this.jsonWrite(response,updateResult);
                        connection.release(); //释放资源链接
                    })
                });
            }
        })
    })
});
/**
 * todo：更新权限列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/auth-update',function (request,response) {
    let params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error){throw Error(error);}
        connection.query(__this.$sql.common.select,['sys_auth',__this.mysql.escape(params.id)],function (error,selectResult) {
            if (error) { throw error }
            if (selectResult.length<1) {
                response.code = __this.code.ERROR;
                response.msg = error;
                __this.jsonWrite(response);
                connection.release(); //释放资源链接
                return;
            }
            if (selectResult[0].path.indexOf(params.id)<1){
                params.path = selectResult[0]['path']+','+params.id;
                params.level = eval(__this.func.str_count(params.path,',')+1);
            }
            connection.query(__this.$sql.auth.update, [params.name,params.url,params.status,params.pid,params.level,params.path,params.id],function (error,result) {
                if (error){
                    connection.rollback(function() {throw Error(error)});  //如果失败回滚
                }
                if (result.length<1){
                    response.code = __this.code.ERROR;
                    response.msg = error;
                    __this.jsonWrite(response);
                    connection.release(); //释放资源链接
                    return;
                }
                __this.jsonWrite(response,result);
                connection.release() //释放资源
            })
        })
    })
});
module.exports = __this.router;