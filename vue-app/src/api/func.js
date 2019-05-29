const md5 = require('js-md5');
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
    const arr = [];
    for (const i in item){
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
    return md5(md5(pass)+md5(slat));
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
};
module.exports = func;