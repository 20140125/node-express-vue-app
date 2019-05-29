# node-express-vue-app
###express-app 
```
服务端代码，数据库操作，提供接口
自定义方法：
   config/func

       str_count : 计算字符串出现的次数,
       set_time : 设置时间,
       repeat_str : 重复输出字符串,
       set_tree : 无限级分类,
       get_timestamp : 获取当前时间戳,
       set_random : 随机输出字符串,
       str_shuffle : 随机打乱字符串,
       set_password : 设置密码,
       read_dir : 文件夹读取,
       read_file : 文件读取,
       write_file : 文件写入,
       rename_file : 文件重命名,
       mk_file : 文件新建,
       unlink_file : 文件/文件夹删除
       
数据库配置       
   config/db
   
SQL文件
   config/sqlMap
   
routers 路由文件
   api：接口操作
   auth：权限操作
   base：基础配置
   category：接口分类
   common：公共权限
   file：文件操作
   log：系统日志
   role：角色操作
   user：管理员操作
      
```
####vue-app
```
前端代码，页面逻辑，调用 express-app提供的接口对数据库进行一系列操作
页面包含：
  1：权限列表 （auth）
  2：角色列表 （role）
  3：管理员列表  （user）
  4：系统日志管理 （system/log）
  5：api接口管理 (api)
  6：文件管理 (system/file)
```
