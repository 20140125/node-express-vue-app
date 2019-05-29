import url from './url';
import request from './request.js'

const authLists = function (params) {
    return request.post(url.authLists,params)
};
const roleLists = function(params){
    return request.post(url.roleLists,params)
};
const authTree = function(params){
    return request.post(url.tree,params)
};
const userLists = function(params){
    return request.post(url.userLists,params)
};
const logLists = function(params){
    return request.post(url.logLists,params)
};
const apiLists = function (params) {
    return request.post(url.apiLists,params)
};
const categoryLists = function (params) {
    return request.post(url.categoryLists,params)
};
const fileLists = function (params) {
    return request.post(url.fileLists,params)
};
const fileRead = function (params) {
    return request.post(url.fileRead,params)
};
const fileRename = function (params) {
    return request.post(url.fileRename,params)
};
const fileSave = function (params) {
    return request.post(url.fileSave,params)
};
const fileDelete = function (params) {
    return request.post(url.fileDelete,params)
};
const interfaceLists = {
    AuthLists:authLists,
    RoleLists:roleLists,
    AuthTree:authTree,
    UserLists:userLists,
    LogLists:logLists,
    ApiLists:apiLists,
    CategoryLists:categoryLists,
    FileLists:fileLists,
    FileRead:fileRead,
    FileRename:fileRename,
    FileSave:fileSave,
    FileDelete:fileDelete
};
export default interfaceLists;