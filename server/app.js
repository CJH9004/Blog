// path
const path = require('path')

//koa
const Koa = require('koa');
const app = new Koa();

//配置文件
const config = require('./configs');

//适配vue history的中间件
const historyApiFallback = require('koa2-connect-history-api-fallback');
// handle fallback for HTML5 history API
app.use(historyApiFallback({ whiteList: ['/api', '/admin'] }));

//response中间件
const response = require('./middlewares/response.js');

//try/catch中间件
const errorHandle = require('./middlewares/errorHandle.js');

//initAdmin中间件
const initAdmin = require('./middlewares/initAdmin.js');

//引入路由
const router = require('./routes');

//配置静态目录
const static = require('koa-static')
const staticPath = './dist/'
app.use(static(
  path.join( __dirname, staticPath)
))

//mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoUrl = `mongodb://${ config.mongodb.user }:${ config.mongodb.password }@${ config.mongodb.host }:${ config.mongodb.port }/${ config.mongodb.database }`; 
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.on('error', () => {
    console.log('数据库连接出错!');
});
db.once('open', () => {
    console.log('数据库连接成功！');
});

//输出请求的方法，url,和所花费的时间
app.use(async (ctx, next) => {
    let start = new Date();
    await next();
    let ms = new Date() - start;
    console.log(`${ ctx.method } ${ ctx.url } - ${ ms } ms`);
});

//bodyParser中间件
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

//使用response中间件(放在最前面)
app.use(response);

//使用errorHandle中间件
app.use(errorHandle);


//使用initAdmin中间件
app.use(initAdmin);

//使用路由中间件
app
    .use(router.routes())
    .use(router.allowedMethods());

//监听端口
app.listen(config.app.port, () => {
    console.log('The server is running at http://localhost:' + config.app.port);
});