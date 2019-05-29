const __this = require('./base');
/**
 * todo：获取接口列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/interface-lists',function (request,response) {
    let params = request.body;
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw error}
        connection.query(__this.$sql.api.select,[params.type],function (error,result) {
            if (error) {throw  error}
            if (result.length<1){
                response.code = __this.code.ERROR;
                response.msg = error;
                __this.jsonWrite(response);
                connection.release();
                return ;
            }
            __this.jsonWrite(response,result);
            connection.release();
        })
    })
});
/**
 * todo：保存接口列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/interface-save',function (request,response) {
    const params = request.body;
    params.request = JSON.stringify(params.request);
    params.response = JSON.stringify(params.response);
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw  error}
        connection.query(__this.$sql.api.add,
            [params.desc,params.type,params.href,params.method,params.request,params.response,params.response_string,params.remark],function (error,result) {
            if (error) {
                connection.rollback(function () {throw error});
            }
            if (result){
                __this.jsonWrite(response);
                connection.release();
            }

        })
    })
});

/**
 * todo：更新接口列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/interface-update',function (request,response) {
    const params = request.body;
    params.request = JSON.stringify(params.request);
    params.response = JSON.stringify(params.response);
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw  error}
        connection.query(__this.$sql.api.update,
            [params.desc,params.type,params.href,params.method,params.request,params.response,params.response_string,params.remark,params.id],function (error,result) {
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
});
module.exports = __this.router;