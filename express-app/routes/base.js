const models = require('../config/db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');  //MySql数据库
const $sql = require('../config/sqlMap');
const func  = require( '../config/func');  //自定义函数
const code = require('../config/code');
const fse = require('fs-extra');
const http = require('../config/request');
//连接池链接数据库
const pool = mysql.createPool(models.mysql);
/**
 * todo：json信息输出
 * @param response
 * @param result
 */
const jsonWrite = function(response, result=[]) {
    if(typeof result === 'undefined') {
        response.json({ code: code.ERROR, msg: '操作失败' });
    } else {
        let data = {};
        data['code'] = typeof response.code === 'undefined'?code.SUCCESS:response.code;
        data['msg'] = typeof response.msg === 'undefined'?'Success':response.msg;
        data['result'] = result;
        response.json(data);
    }
};
const base = {
    router:router,
    $sql:$sql,
    func:func,
    pool:pool,
    mysql:mysql,
    code:code,
    fse:fse,
    request:http,
    jsonWrite:jsonWrite
};
//基础配置
module.exports = base;
