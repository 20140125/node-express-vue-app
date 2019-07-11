const md5 = require('js-md5');
const fse = require('fs-extra');
/**
 * todo：获取一个字符串出现的次数
 * @param str
 * @param char
 * @returns {number}
 */
const str_count=function (str, char) {
    let pos;
    let arr = [];
    pos = str.indexOf(char);
    while (pos > -1) {
        arr.push(pos);
        pos = str.indexOf(char, pos + 1);
    }
    return arr.length;
};
/**
 * todo：时间戳转换
 * @param times
 * @param timestamp
 * @returns {string}
 */
const t = function(times = true,timestamp){
    let date = new Date(timestamp);
    let Y = date.getFullYear();  // 获取完整的年份(4位,1970)
    let M = (date.getMonth()+1)<10?'0'+eval(date.getMonth()+1):date.getMonth()+1;  // 获取月份(0-11,0代表1月,用的时候记得加上1)
    let D = (date.getDate()<10)?'0'+date.getDate():date.getDate();  // 获取日(1-31)
    let h = (date.getHours()<10)?'0'+date.getHours():date.getHours();  // 获取小时数(0-23)
    let m = (date.getMinutes())<10?'0'+date.getMinutes():date.getMinutes();  // 获取分钟数(0-59)
    let s = (date.getSeconds()<10)?'0'+date.getSeconds():date.getSeconds();  //获取秒数
    if (times){
        return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s;
    } else {
        return Y+'-'+M+'-'+D+'.log';
    }
};

/**
 * todo：获取时间戳
 * @return {number}
 */
const get_timestamp=function() {
    return Math.round(new Date().getTime()/1000);
};
/**
 * todo：设置时间
 * @param timestamp
 * @returns {string}
 */
const set_time=function(timestamp){
    return t(true,timestamp);
};

/**
 * todo：重复字符串输出
 * @param str
 * @param char
 * @param repeatStr
 * @return {string}
 */
const repeat_str=function(str,char,repeatStr='　　'){
    let count = str_count(str,char);
    return Array(count).join(repeatStr)
};

/**
 * todo：设置树形结构
 * @param item
 * @param pid
 * @return {Array}
 */
const set_tree=function (item,pid=0){
    let arr = [];
    for (let i in item){
        //item[i].disabled = item[i].id == 1?true:false;  //根据个人需求开启
        if (item[i].pid === pid) {
            item[i].__child = set_tree(item,item[i].id);
            arr.push(item[i]);
        }
    }
    return arr;
};

/**
 * todo：获取随机数
 * @param length 随机字符串长度
 * @param type 随机数类型
 * @return {string|string}
 */
const set_random=function (length = 8,type='all'){
    let str;
    switch (type) {
        case 'all': str = 'MNBVCXZASDFGHJKLPOIUYTREWQ0123456789qwertyuioplkjhgfdsazxcvbnm';break;
        case 'number': str='0123456789';break;
        case 'l': str='QWERTYUIOPLKJHGFDSAZXCVBNM';break;
        case 's': str='zxcvbnmlkjhgfdsaqwertyuiop';break;
        default:break;
    }
    let char='';
    for (let i=0;i<length;i++){
        char+=str_shuffle(str).substring(0,1);
    }
    return char
};

/**
 * todo：随机打乱字符串
 * @param str 字符串
 * @return {string}
 */
const str_shuffle=function(str){
    let char='';
    for (let i=str.length;i>0;i--){
        let j = Math.random()*(i+1)|0;
        char+=str[j];
    }
    return char
};

/**
 * todo：设置密码
 * @param pass
 * @param slat
 * @return {string}
 */
const set_password=function(pass,slat){
    return md5(md5(pass)+md5(slat.toString()));
};

/**
 * todo：读取文件
 * 'atime':statSync.atime,  //表明上次访问此文件的时间戳。
 * 'mtime':statSync.mtime,  //表明上次修改此文件的时间戳。
 * 'ctime':statSync.ctime,  //表明上次更改文件状态的时间戳。
 * 'birthtime':statSync.birthtime,  //表示此文件的创建时间的时间戳。
 * @param path
 * @return {Array}
 */
const read_dir=function(path){
    let result = [];
    const fileLists = fse.readdirSync(path.toString());
    fileLists.forEach(function (ele,index) {
        let statSync = fse.statSync(path+'/'+ele);
        if (ele!=="node_modules") {
            result.push({
                'name':ele,
                'size':statSync.size, //文件大小
                'file':statSync.isFile(), //是否是文件
                'directory':statSync.isDirectory(), //是否是目录
                'path':path+'/'+ele,
            })
        }
    });
    result.forEach(function (item,index) {
        if (false!==item.directory){
            result[index].__child = read_dir(item.path)
        }
    });
    return result;
};
/**
 * todo：文件读取
 * @param filename
 * @return {*}
 */
const read_file = function (filename) {
    let file;
    if (fse.statSync(filename).isFile){
        file = fse.readFileSync(filename, 'utf8');
        return file;
    }
    return file;
};
/**
 * todo：文件更新
 * @param filename
 * @param data
 * @return {boolean}
 */
const write_file = function (filename,data) {
    if (fse.statSync(filename).isFile){
        try {
            fse.writeFileSync(filename,data,'utf-8');
            return true;
        }catch (e) {
            console.log(e);
            return false;
        }
    }
    return false
};
/**
 * todo：文件新建
 * @param filename
 */
const mk_file = function (filename) {
    //新建文件
    if (!fse.existsSync(filename)){
        let file =  filename.substring(filename.lastIndexOf('/'));
        if (file.indexOf('.')>=0){
            fse.open(filename, 'w+', (err, fd) => {
                if (err) throw err;
                fse.close(fd, (err) => {
                    if (err) throw err;
                });
            });
        } else {
            fse.mkdir(filename, { recursive: true }, (err) => {
                if (err) throw err;
            })
        }
    }
};
/**
 * todo：文件删除
 * @param filename
 * @return {boolean}
 */
const unlink_file = function (filename) {
    try {
        let file =  filename.substring(filename.lastIndexOf('/'));
        if (file.indexOf('.')>=0){
            fse.unlinkSync(filename);
        } else {
            fse.rmdir(filename);
        }
        return true
    } catch (err) {
        // 处理错误
        console.log(err);
        return false;
    }
};
/**
 * todo：文件重命名
 * @param oldPath
 * @param newPath
 * @return {boolean}
 */
const rename_file = function (oldPath, newPath) {
    try {
        fse.rename(oldPath,newPath);
        return true
    }catch (e) {
        console.log(e);
        return false;
    }
};

const func = {
    str_count:str_count,
    set_time:set_time,
    repeat_str:repeat_str,
    set_tree:set_tree,
    get_timestamp:get_timestamp,
    set_random:set_random,
    str_shuffle:str_shuffle,
    set_password:set_password,
    read_dir:read_dir,
    read_file:read_file,
    write_file:write_file,
    rename_file:rename_file,
    mk_file:mk_file,
    unlink_file:unlink_file
};
module.exports = func;
