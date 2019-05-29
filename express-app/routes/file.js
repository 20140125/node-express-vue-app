const __this = require('./base');
/**
 * todo：获取文件列表
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/file-lists',function (request,response) {
    let params = request.body,result={};
    result.filelists = __this.func.read_dir(params.path);
    //获取文件列表
     __this.jsonWrite(response,result);
});
/**
 * todo：读取文件
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/file-read',function (request,response) {
    let params = request.body,result={};
    //获取文件列表
    result.content = __this.func.read_file(params.path);
    __this.jsonWrite(response,result);
});
/**
 * todo：文件保存
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/file-save',function (request,response) {
    let params = request.body;
    //新建文件/文件夹
    __this.func.mk_file(params.path);
    __this.jsonWrite(response);
});
/**
 * todo：文件更新
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/file-update',function (request,response) {
    let params = request.body;
    //获取文件列表
    __this.func.write_file(params.path,params.content);
    __this.jsonWrite(response);
});
/**
 * todo：文件重命名
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/file-rename',function (request,response) {
    let params = request.body;
    //获取文件列表
    __this.func.rename_file(params.old,params.curr);
    __this.jsonWrite(response);
});
/**
 * todo：文件删除
 * @param request 用户请求参数
 * @param response 返回参数
 */
__this.router.post('/file-delete',function (request,response) {
    let params = request.body;
    //删除文件
    if (__this.func.unlink_file(params.path)){
        __this.jsonWrite(response);
        return;
    }
    response.code = __this.code.ERROR;
    __this.jsonWrite(response);

});
module.exports = __this.router;