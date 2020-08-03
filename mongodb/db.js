'use strict';

import mongoose from 'mongoose';
import chalk from 'chalk';
const config = require('config-lite')(__dirname);

console.log('--------config---------', config.url);

// FuseMongoClient: true,
mongoose.connect(config.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
/**
 * 使用 Node 自带 Promise 代替 mongoose 的 Promise
 */

const db = mongoose.connection;

db.once('open', () => {
  console.log(
    chalk.green('连接数据库成功')
  );
})

db.on('error', function (error) {
  console.error(
    chalk.red('Error in MongoDb connection: ' + error)
  );
  mongoose.disconnect();
});


// 断开超时自动连接
db.on('close', function () {
  console.log(
    chalk.red('数据库断开，重新连接数据库')
  );
  mongoose.connect(config.url, {
    server: {
      auto_reconnect: true
    }
  });
});

export default db;