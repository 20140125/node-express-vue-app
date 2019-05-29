const __this = require('./base'); //加载基础配置
/**
 * todo：获取日志列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/log-lists',function (request,response) {
    let params = request.body,result={};
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw  error}
        connection.query(__this.$sql.log.select,[params.offset,params.limit],function (error,logResult) {
            if (error) {throw error}
            if (logResult){
                result.log = logResult;
                connection.query(__this.$sql.common.total,['sys_log'],function (error,totalResult) {
                    if (error) {throw error}
                    if (totalResult){
                        result.total = totalResult[0]['total'];
                        __this.jsonWrite(response,result);
                        connection.release();
                    }
                })
            }
        })
    })
});
/**
 * todo：添加日志
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/log-save',function (request,response) {
    let params = request.body;
    params.ip_address = request.ip;
    params.created_at = __this.func.get_timestamp().toString();
    __this.pool.getConnection(function (error,connection) {
        if (error) {throw  error}
        connection.query(__this.$sql.log.add,[params.username,params.ip_address,params.info,params.created_at],function (error,result) {
            if (error) {throw error}
            if (result){
                __this.jsonWrite(response,result);
                connection.release();
            }
        })
    })
});
module.exports = __this.router;