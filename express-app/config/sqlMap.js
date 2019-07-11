// noinspection SqlResolve
let sqlMap = {
    auth:{
        select: 'select `id`,`name`,`level`,`pid`,`url`,`status` from `sys_auth` where level<=? order by `path`',
        add: 'insert into `sys_auth` set `name`=?,`url`=?,`status`=?,`pid`=?,`level`=?,`path`=?',
        update: 'update `sys_auth` set  `name`=?,`url`=?,`status`=?,`pid`=?,`level`=?,`path`=? where `id`=?',
    },
    role:{
        select: 'select * from `sys_role` limit ?,?',
        selectAll: 'select `id`,`role_name` from `sys_role` where `status`=?',
        add: 'insert into `sys_role` set `role_name`=?,`urls`=?,`ids`=?,`status`=?,`created_at`=?,`updated_at`=?',
        update: 'update `sys_role` set `role_name`=?,`urls`=?,`ids`=?,`status`=?,`updated_at`=? where `id`=?',
    },
    users:{
        select: 'select * from `sys_user` limit ?,?',
        add: 'insert into `sys_user` set `username`=?,`email`=?,`password`=?,`salt`=?,`access_token`=?,`role_id`=?,`created_at`=?,`updated_at`=?,`status`=?',
        update: 'update `sys_user` set `username`=?,`email`=?,`password`=?,`salt`=?,`access_token`=?,`role_id`=?,`updated_at`=?,`status`=?,`phone_number`=? where `id`=?',
    },
    log:{
        select: 'select * from `sys_log` order by `id` desc limit ?,?',
        add: 'insert into  `sys_log` set `username`=?,`ip_address`=?,`info`=?,`created_at`=?',
    },
    api:{
        select: 'select * from `sys_api_lists` where `type`=? limit 1',
        add: 'insert into `sys_api_lists` set `desc`=?,`type`=?,`href`=?,`method`=?,`request`=?,`response`=?,`response_string`=?,`remark`=?',
        update: 'update `sys_api_lists` set  `desc`=?,`type`=?,`href`=?,`method`=?,`request`=?,`response`=?,`response_string`=?,`remark`=? where `id`=?'
    },
    category:{
        select: 'select * from `sys_api_category` order by `path`',
        add: 'insert into `sys_api_category` set `name`=?,`pid`=?,`status`=?,`level`=?,`path`=?',
        update: 'update `sys_api_category` set `name`=?,`pid`=?,`status`=?,`level`=?,`path`=? where `id`=?'
    },
    common:{
        select: 'select * from ?? where `id` =?',
        total: 'select count(*) as total from ?? limit 1',
        delete: 'delete from ?? where `id` =?',
        status: 'update ?? set `status`=? where `id`=?'
    }
};
module.exports = sqlMap;
