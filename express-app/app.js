const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const app = express();
//session 配置
app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:false,
    cookie:{
        path:'/',
        httpOnly:true,
        maxAge:1000*3600*24
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//允许跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",'Express');
    if(req.method==="OPTIONS") res.send(200); /*让options请求快速返回*/
    else  next();
});

//登录拦截 （线上环境打开）
// app.use(function (req,res,next) {
//     console.log(req.session);
//     if(!req.session.access_token && req.url!=='/api/common-login'){
//         res.send(401);
//     }else{
//         next()
//     }
// });

//路由列表
app.use('/api', require('./routes/auth'));  //权限
app.use('/api',require('./routes/common')); //公有
app.use('/api',require('./routes/role'));   //角色
app.use('/api',require('./routes/user'));   //管理员
app.use('/api',require('./routes/log'));    //系统日志
app.use('/api',require('./routes/api'));    //接口
app.use('/api',require('./routes/category'));    //接口分类
app.use('/api',require('./routes/file'));    //文件列表

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
