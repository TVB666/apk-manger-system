import history from 'connect-history-api-fallback';
import express from 'express';
import bodyParser from 'body-parser'
import dayjs from  'dayjs';
import router from './router/index.js';
import chalk from 'chalk'
import db from './mongodb/db.js';
const config = require('config-lite')(__dirname);   // 配置 && 代码分离

// 自定义log 带上时间输出
console.oldlog = console.log;
function log(){
  process.stdout.write('\n'+ dayjs().format('YYYY-MM-DD HH:mm:ss') + ': ');
  console.oldlog.apply(console, arguments);
}
console.log = log;



const app = express()
// app.use(history());
app.use(bodyParser.urlencoded({extended: false})) //解析表单数据需要用到的模块
app.use(bodyParser.json())

// app.all('*', (req, res, next) => {
//   const { origin, Origin, referer, Referer } = req.headers;
//   const allowOrigin = origin || Origin || referer || Referer || '*';
// 	res.header("Access-Control-Allow-Origin", allowOrigin);
// 	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
// 	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Credentials", true); //可以带cookies
// 	res.header("X-Powered-By", 'Express');
// 	if (req.method == 'OPTIONS') {
//   	res.sendStatus(200);
// 	} else {
//     next();
// 	}
// });

//声明后端接口的访问路由

router(app);

// app.use(express.static('./public')); 前端打包后丢这个文件夹
app.listen(config.port, () => {
	console.log(
		chalk.green(`成功监听端口：${config.port}`)
	)
});

