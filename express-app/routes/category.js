const __this = require('./base');
/**
 * todo：获取接口分类列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/category-lists',function (request,response) {
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw error}
        connection.query(__this.$sql.category.select,function (error,result) {
            if (error) {throw  error}
            if (result){
                __this.jsonWrite(response,result);
                connection.release();
            }
        })
    })
});
/**
 * todo：保存接口分类列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/category-save',function (request,response) {
    const params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw  error}
        connection.query(__this.$sql.category.add, [params.name,params.pid,params.status,params.level,params.path],function (error,insertResult) {
            if (error) {
                connection.rollback(function () {throw error});
            }
            if (insertResult){
                connection.query(__this.$sql.common.select,['sys_api_category',params.pid],function (error,selectResult) {
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
                    connection.query(__this.$sql.category.update, [params.name,params.pid,params.status,params.level,params.path,insertResult.insertId],function (error,result) {
                        if (error) {
                            connection.rollback(function () {throw error});
                        }
                        if (result.length<1){
                            response.code = __this.code.ERROR;
                            response.msg = error;
                            __this.jsonWrite(response);
                            connection.release();
                            return ;
                        }
                        __this.jsonWrite(response);
                        connection.release();
                    })
                });
            }
        })
    })
});

/**
 * todo：更新接口分类列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/category-update',function (request,response) {
    let params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error){throw Error(error);}
        connection.query(__this.$sql.common.select,['sys_api_category',__this.mysql.escape(params.id)],function (error,selectResult) {
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
            connection.query(__this.$sql.category.update, [params.name,params.pid,params.status,params.level,params.path,params.id],function (error,result) {
                if (error) {
                    connection.rollback(function () {throw error});
                }
                if (result.length<1){
                    response.code = __this.code.ERROR;
                    response.msg = error;
                    __this.jsonWrite(response);
                    connection.release();
                    return ;
                }
                __this.jsonWrite(response);
                connection.release();
            })
        })
    })
});
module.exports = __this.router;